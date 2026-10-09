---
title:  "The importance of re-evaluating habits"
date:   2016-08-26
---
A few minutes ago I was writing a unit test when I suddenly experienced a feeling that is most easily described as "joy".  And in that flood of joy, I was reminded that it's a really good idea to periodically re-evaluate the habits of your life.

The concept of "habits" often gets a bad rap due to its frequent association with the word "bad" and the inflexibility that habits imply.  Both of those are, in my opinion, unfortunate associations.  I'm a strong believer in the idea that, with a bit [^1] of self-awareness and focused attention, your habits can be curated and groomed so that the good ones are encouraged to flourish and the bad ones can be gently weeded out.  You can even consciously plant the seeds for new habits.

Back to unit tests.  While I do have a deep appreciation of unit testing that perhaps even merits an "I ♥ Unit Tests" sticker, my happiness as it relates to testing is usually most profoundly felt when I'm doing one of two things:

1. refactoring or otherwise modifying pre-existing code and the code is accompanied by solid test coverage
2. I'm writing tricky code with lots of edge cases and I've written my tests first and it's helping me to confidently nail the implementation

A few minutes ago, I was doing neither of these two things.  Instead, I was writing some very simple code that, although different in its details from what I'll show below was, more or less, exactly what you see below (I changed the specifics to avoid the distraction of domain details):

```java
    @Test
    public void shouldThrowExceptionForNegativeAccelerations() throws Exception {
        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> vehicle.accelerate(-1))
                .withMessage("Acceleration must be > 0");
    }
```

"So, wtf?  Where's the joy in that?"

The joy, for me, is in the sheer simplicity and readability of the code and the fact that, above all else, the *intent*[^2] of the code sings out clear as a bell.  The joy, for me, is in writing code using an API that is well-thought out and discoverable via auto-complete.  I didn't have to stumble around with documentation or find the right matchers to quickly do what I wanted to do.  And the joy, in this specific case, was being able to easily make an assertion around the exception type *and the message*.

In short, the joy I was feeling was because I was using [AssertJ](http://joel-costigliola.github.io/assertj/) for writing my assertions.  The reminder to re-evaluate my habits was because, despite AssertJ being "old news", it's only within the last half-year that I finally stopped to look around and realized that my existing coding habits could be improved by switching to AssertJ.  My experience with switching to AssertJ pretty much exactly mirrors the experience I had when, several years ago, I switched to using [Mockito](http://mockito.org/) for mocks.

And so, of course, now I'm wondering what of my other coding habits need re-evaluating?  Any suggestions based on your own experiences of changed habits that brought you more joy (coding or otherwise)?

Notes:

[^1]: Ok, sometimes a whole lot more than "a bit"
[^2]: Right up there with "does what it's supposed to do", "clarity of intent" is one of the very top things I try to think about when I’m writing or reviewing code.  In fact, without the clarity, it's so much harder to even evaluate the code!
