---
title:  "99.99% uptime in 6 simple steps"
date:   2016-08-23
---
The secret to building applications with rock-solid stability is shockingly simple:

1. instrument the *f**k* out of your application
2. monitor the instrumentation
3. experience problems
4. fill in any instrumentation/monitoring gaps that would have helped you *notice or understand* the problem sooner or more easily
5. fix the root cause of the problem
6. wait for the next problem

**Robust applications do not spring forth fully formed as if from the head of Zeus, they evolve over time.** [^1]

The beauty of this heuristic is its simplicity and that it **leverage the fact that you already have to deal with live site problems**; it also guarantees that you'll be working on shoring up your defenses against real-world problems and not imagined concerns.  Although simple in concept, it takes a surprising amount of discipline to execute on the plan as there's always the pressure to take short-cuts (or outright skip!) steps 4 and/or 5.

For example, how many times have you seen a problem "fixed" by restarting a service?  Whatever time would have been spent fixing the actual issue is almost aways more than made up for by the cumulative time, distraction, and fatigue that would otherwise be wasted repeatedly responding to the same problem. [^2]

Similarly, when you're under pressure to get back to your other project, it's all too tempting to skip adding the instrumentation / monitoring that would have let you instantly understand what the underlying problem was in the first place.  Typically, the rationale is something like: "*I fixed the root problem, it won't happen again, and so I don't need to add any additional instrumentation or monitoring*." [^3]

The mistake with that line of thinking is that even if the same problem really won't ever happen again, **adding the additional instrumentation / monitoring will help you more quickly understand and respond to *all problems of that same category*.**  This is a critical point!  It's gaining the protection against entire classes of problems that is the key to step 4 and that allows you to, down the road, identify novel problems before they impact users.

As a trivial example, if your JVM process crashed due to a memory leak, after you fix the underlying leak, you should still add the missing monitoring of the JVM's heap size (and possibly GC times, etc) so that all *future* memory-related issues are recognized *before* they crash or otherwise impair the JVM.

Having successfully improved a number of applications using this iterative approach, I'm convinced that the short-term costs of investing in improving existing systems is well worth the long-term gains.  Live applications that require little to no operational overhead and developer involvement are worth their weight in gold in terms of overall team productivity (not to mention end-user experience!). **Interrupting in-progress work to put out a live fire is, besides being unpleasant, horribly inefficient and disruptive to the larger endeavor of succeeding at whatever it is you're trying to do.**  In the extreme cases, operational fatigue from regularly being in a reactive mode is a complete morale and productivity killer.

What follows are some practical suggestions based on my personal experience.  The suggestions are, of course, neither comprehensive (they primarily focus on one aspect of monitoring Java-based applications) nor exclusive (there's lots of other routes you can take).  However, I can say that what follows has been validated in critical production systems -- including a core system that now handles millions of searches a day across a catalog of a billion products and through which a majority of company revenue flows.  If what I describe is compatible with your ecosystem, I'm confident you'll be happy with the end results.

#### **Avoid Tight Coupling (that includes monitoring!)**

One of the challenges of monitoring complex systems that can slowly (or quickly) creep up on you is that complex systems typically require similarly complex monitoring.  **If you're not careful, you end up distributing *deep understanding* of your application's internals into your monitoring system.**  This creates tight coupling between the two systems.  Needless to say, tight coupling, whether at a code-level or a systems-level, always creates fragility, is more difficult to maintain, and slows down development.  Seemingly trivial changes to your application end up cascading into your monitoring layer.  At best, you keep track of the dependencies and carefully make changes to the two systems in concert.  At worst, you're unpleasantly surprised by a bunch of alerts going off when you deploy and you end up either rolling back the release, disabling the alerts (hopefully temporarily!), or scrambling to update the monitoring.

Although some amount of understanding of your applications by your monitoring layer is usually unavoidable, **one simple way to avoid tight coupling is to make the system being monitored responsible for what constitutes a healthy internal state**.  When the application is in charge of self-reporting its healthiness, it's free to interrogate deep implementation details without having to explicitly surface those implementation details.  And suddenly, it's easy to evolve the monitoring as the implementation details change.  Moreover, b/c the code is living in one place, **any friction to adding extensive monitoring of the health of your application's internals disappears.**  For one approach on how to do this, keep reading.

#### **Dropwizard & Metrics**

At my current job, we've been implementing a lot of our services using the Java framework [Dropwizard](http://www.dropwizard.io/).  It self-describes itself as a "framework for developing ops-friendly, high-performance, RESTful web services." In this context, what I really like about Dropwizard is the "ops-friendly" part.  And, specifically, the fact that it uses the [Metrics](http://metrics.dropwizard.io) library to expose a very simple but very powerful `/healthcheck` endpoint over http. [^4]

You can [read up on health checks](http://www.dropwizard.io/1.0.0/docs/manual/core.html#health-checks) but, in short, what they give you is the ability to easily write a "small self-test which your application performs to verify that a specific component or responsibility is performing correctly."  **The `/healthcheck` endpoint provides a *consistent hook across applications* that allows your monitoring systems to interrogate the health of your applications without needing to understand a single implementation detail.**  Requests to the endpoint return a 200 status code if all of the internal health checks pass and a 500 status code if something is not healthy.  You won't be surprised that there's some friendly json to let you know what check(s) failed.

Out of the box, Dropwizard comes with a check to verify that there are no thread deadlocks and, beyond that, you're heavily encouraged to write your own checks.  *Lots of them.*  Checks are incredibly simple to write and you can use them to check on the health of anything you can think of...  In the past, we've used them for all sorts of things such as:

1. JCBC connection pool is functioning
2. Elasticsearch cluster is accessible
3. AWS S3 Bucket is accessible
4. AWS Redshift Cluster is available/healthy
5. Guava-based Service is running
6. Queues are accessible and not backing up
7. Batch processing job has not failed
8. In-memory data is not stale
9. etc, etc, etc

**The real beauty/point here is that you can write specific checks to verify any aspect of *your* application's functionality, dependencies, etc.  Moreover, those checks live within your same application, eliminating coupling across systems and friction during development.**  Less friction means more checks.

Although a super powerful and useful approach, health checks, by design, aren't an all purpose monitoring system.  Specifically, the semantics are pass/fail and there's no concept of "warn" or any (built-in) ability to externally adjust thresholds for alerting.  However, it's such an incredibly useful facility that I heavily rely on it to perform core monitoring of the health of the applications I build.  You do need to be thoughtful as to what kind of checks you add to the system keeping in mind that they need be unambiguous and actionable red/green checks.

It's worth noting that the Metrics library also exposes a `/metrics` endpoint with low-level and fairly comprehensive instrumentation of the JVM, service requests, error logging, etc.  If you're not already familiar with it, think along the lines of request rates, response times broken out by percentiles, etc.  Although I'm not going to focus on that functionality in this post, it's extremely helpful, supports a wide-range of custom metrics, and provides a nice complement to the `/healthcheck` endpoint.  There's also a wide range of "reporters" that allow publishing of metric data into systems like, for example, Graphite. [^5]

As an example of health checks in action, here's a somewhat fictionalized healthy response illustrating the simple red/green semantics of the healthchecks and the optional inclusion of a detailed human-oriented message (typically you always include detailed messages, stack traces, etc if there's a failure):

```json
{
	"deadlocks": {
		"healthy": true
	},
	"messageProcessorIsRunningHealthCheck": {
		"healthy": true
	},
	"messageQueueHealthCheck": {
		"healthy": true,
		"message": "There are 106 queued messages (want <= 250000) and 10 consumers (want >= 10)"
	},
	"importerServiceIsRunningHealthCheck": {
		"healthy": true
	},
	"merchandiseColorSizeLoaderHealthCheck": {
		"healthy": true
	},
	"rabbitMQHealthCheck": {
		"healthy": true
	},
	"redshiftClusterHealthCheck": {
		"healthy": true,
		"message": "Cluster status is 'available' and maintenance window is UTC 'fri:08:30-fri:09:00' (currently 2016-08-23T16:14:37.497Z)"
	},
	"redshiftDataSourceHealthCheck": {
		"healthy": true
	},
	"s3BucketIsReadableHealthCheck": {
		"healthy": true
	},
	"sqsHealthCheck": {
		"healthy": true
	}
}
```

#### **Alerting on /healthcheck failures from New Relic**

Although the Metrics library provides the `/healthcheck` endpoint, you still need something to regularly probe the application and alert you if it enters an unhealthy state.  At my current company, we use New Relic for a substantial portion of our monitoring.  New Relic has nothing out of the box to support this type of monitoring but it does have an extensible plugin framework that you can customize as necessary.

**The [Dropwizard plugin for New Relic that I wrote](https://github.com/dbaggott/newrelic-dropwizard#new-relic-dropwizard-plugin--) provides the bridge between New Relic and your Metrics-enabled applications.**  The plugin allows you to easily receive alerts via NR whenever your Dropwizard application enters into an unhealthy state. Additionally, you can optionally configure NR to send alerts whenever the rate of 4xx responses, 5xx responses, logged errors, and/or JVM heap utilization exceeds configured thresholds. Thresholds for alerting can be configured on a per application basis within NR.

In addition to providing a basis for alerting on your application, the plugin comes with a fairly rich UI to provide historical data on both your healthcheck failures as well as a whole slew of performance metrics (i.e., the ones exposed via the `/metrics` endpoint).

Here's one of the views of the New Relic plugin dashboard (you can see samples of the rest [over on github](https://github.com/dbaggott/newrelic-dropwizard#new-relic-plugin-dashboard-ui)):

![Overview](/images/writings/healthcheck-overview.png)

#### **Peace of Mind**

If you're anything like me, then you've probably woken up in the middle of the night with that "oh crap" feeling as you suddenly realize that there's some (perhaps unlikely) edge case failure scenario that you didn't previously consider and which, if it went undetected, would be insidiously bad.  Now, when that happens to me, I'm often able to go right back to sleep because I know that the next day I'll simply write a new health check.

Sleep well!

Notes:

[^1]: Poetic license aside, the truth is that there is **some** amount of "springing forth fully formed" as there are any number of problems and failure scenarios that can and should! be anticipated and planned for using the benefit of your own and others' experiences.  Although outside of the scope of this post, sound design is best baked into your architecture and application from the beginning.
[^2]: Moreover, sometimes the underlying cause of an intermittent crash also has less obvious non-intermittent symptoms such as a general performance degradation that you only discover in the process of fixing the intermittent crash!
[^3]: Guilty as charged although I try very, very hard to avoid that pitfall!
[^4]: While the Metrics library comes bundled with Dropwizard, it is a separate library and can be used in any Java-based application -- run embedded Jetty or similar if your application does not already service http requests and you want the http endpoints.
[^5]: I should also add that, because of the significant operational benefits, I've taken to using Dropwizard for non-service applications as well as service applications.  Not only are the `/healthcheck` and `/metrics` endpoints and the reporting of metrics into systems like Graphite invaluable, but having an easy hook for adding runtime operations via [Tasks](http://www.dropwizard.io/1.0.0/docs/manual/core.html#tasks) is awesome!  I've used it to create simple admin APIs for things like temporarily pausing a processor, throttling processing rate, etc