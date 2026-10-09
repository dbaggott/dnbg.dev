---
title:  "Jekyll & GitHub == continuously deployed website in 10 minutes"
date:   2016-08-16
---
*This site has since moved off GitHub Pages: it's now built with Eleventy and served from AWS. The post is as I wrote it in 2016.*

I very recently got around to building this website.  Now that it's up and I'm thinking back on the process, I'm finding myself surprised/pleased that the part that took me the longest was figuring out how I wanted to host the site.  I'm sufficiently thrilled with the simplicity and benefits of where I ended up that I wanted to share.

For context, I should first say that my core requirements for a site are very modest.  Primarily, I want a site where I can share some professional information about myself and make the occasional blog post to share the ah-has! and general ups and downs of writing software.  Secondarily, I wanted to avoid paying anything more than a nominal service fee for hosting the site.  And, of course, I wanted to bring normal engineering standards to the process of maintaining the website.

After consider a number of options (eg [Django](https://www.djangoproject.com/) hosted on [DigitalOcean](https://www.digitalocean.com/)), I ended up using [GitHub Pages](https://pages.github.com/) coupled with [Jekyll](https://jekyllrb.com/).

This is hardly new or groundbreaking technology and [there](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/) are already [plenty](https://jekyllrb.com/docs/github-pages/) of [great](http://jmcglone.com/guides/github-pages/) tutorials [out there](https://www.smashingmagazine.com/2014/08/build-blog-jekyll-github-pages/), so I won't talk about any of that except to say that it was very, very easy to get a site up and running.

Instead, I want to share why I personally love this approach:

1. **Free (as in no work) Continuous Deployments**: GitHub provides tight integration with Jekyll and you get automatic builds and deployments of your site on check-in.  As soon as you merge into master, your change is live.  Not having to think about building or deploying the site (not to mention maintaining a server) is invaluable.
2. **Trivial Site Previewing**: Jekyll makes it super easy to preview changes to your website locally before pushing your changes via the `jekyll serve --watch` command which allows you to view your site on localhost.  "Edit and refresh" makes for rapid iterations.
3. **Familiarity of Markdown**: I'm writing this blog post in simple and familiar markdown which means I really don't have to concern myself with anything other than the content.
4. **Versioned Content**: Github makes drafting (and backing up) changes very easy.  For example, I made a "feature" branch for this post and I can commit and push to that branch as often as I want.  I can take as long as I want to finish the post and have as many in-progress posts as I want without ever worrying about losing them.  And all of that happens automatically b/c it is based on my normal development practices.
5. **Free**: I was willing to pay some nominal amount for website hosting so it's the icing on the cake that this approach is also free.
6. **Jekyll**: Jekyll is new to me but the learning curve for doing simple things is not at all steep and my sense is that, if I ever need it, it affords a considerable amount of flexibility and functionality.
7. **Simple**:  Once you're set-up, doing something like adding a blog post consists of adding a single file with some metadata (date, tile, categories, and tags) and the markdown-based content.  Its hard to imagine it being easier.

If you're thinking about putting together a website or already have one and are experiencing any pain in maintaining it, I highly recommend this approach.  As someone who was already using GitHub, it's been a 100% friction free experience for me as it dovetails perfectly with the tool sets and development habits that I already have.  Create your website using standard tools and everything else happens automatically and painlessly.