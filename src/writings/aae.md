---
title:  "AAE"
date:   2012-12-06
---
*This is based on an email that I originally sent out to fellow engineers at my company.  I probably would have written it somewhat differently for a wider audience (I ony edited it slightly for readability) but, that being said, I strongly believe that acronyms (however well-intentioned) are, at best, not super helpful and, more often, are extremely obfuscating.* 

I'll just come right out and say what I think: when writing code, acronyms (and other abbreviations) are evil and should be avoided like a plague of blood-sucking demon bats.

Here's the (reasonable) arguments for acronyms/abbreviations that I can think of:

1. They are shorter to type
2. They take up less screen space and therefore make the code more compact and easier to read

That's not very many reasons and I don't think either of these reasons are good enough reasons to justify their use.  Modern IDEs have auto-completion and so you don't actually have to type out variable names.  So, generally speaking, typing a long variable name is just as fast as typing a short one.   The second reason is a little bit more compelling to me.  However, I think that whatever benefit is gained by having more compact code is more than offset by the loss of clarity in the code itself.  There's just no getting around it:  acronyms and abbreviations simply don't make sense unless you know what they mean and our goal should be to make our code as easy to understand as possibly can.  The best code self-documents itself by using clear and informative names that don't require any domain-specific knowledge.

For example, consider this real-life code I came across detailing two properties on a "member" user object:

```csharp
public bool AllowMss { get; set; }
public bool AllowFpis { get; set; }
```

What does that mean?  I have no idea!  The only person who knows is someone who is already fairly familiar with the code.  How could a new engineer (or even someone who has worked at that particular company for many years but is coming to the code for the first time) possibly be expected to know what it means?

Or consider some more real-life code for an e-commerce site that had has a concept of virtual money called "cafe cash": if you look in checkout-related code, you'll discover places where the abbreviation 'CC' can stand for either credit card **or** cafe cash.  The inconsistent use even happens within the same class!  But, even if CC were consistently used to always mean "credit card", someone who is looking at the code and knows that there's also a concept of "cafe cash" is still going to wonder whether the CC might stand for cafe cash.  I would go farther though: even for code bases where there is no such thing as cafe cash, what's the clearer name?

PayByCC or PayByCreditCard?

You can't get much clearer than PayByCreditCard!  Everyone will instantly understand that.  Even out of context.  Sure, a lot of people will guess by context that PayByCC means PayByCreditCard but there are going to people who need to hunt around in the code to figure that out / make sure their guess is correct.  And, even if you know what it means, you are still mentally translating PayByCC into PayByCreditCard in your head every time you look at it.  I say there's no reason to make yourself or anyone else perform that extra cycle!

What's a pnlPoliticalContribution?  What's a CbaEmail?  I'm sure that CBA seemed totally obvious when the code I found it in was written but it's not at all obvious to someone who didn't work on that particular project.  What's cbStoreSpecial mean?  Is a taxId referring to the id of a taxonomy node or taxes?  These are all needless opportunities for ambiguity and confusion and therefore heartache in working with the code and bugs for end-users.

So, in my opinion, when should you use acronyms, abbreviations, or otherwise shortened names in your code?  I say never do that unless:

1. you would expect someone interviewing for a job to know what the name means (id, url, http, api, util, svg, etc)
2. the scope of the variable name is extremely limited (a small number of lines of code) and using a shortened name *very* *significantly* improves readability and then only do so judiciously (i.e. still don't do it)
3. for universal conventions such as an index variable name like `i`

There's probably a small number of other reasonable exceptions besides those three.  But, generally speaking, I really think that using full names is a great and simple way to write better code.

*ps Of course, I'm ignoring the importance of code compaction for things like javascript and css where the code is sent across the network.  But that's what compression and minification are for!*