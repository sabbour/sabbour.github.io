---
layout: post
title: Quick and easy way to setup signed GitHub commits on MacOS
date: 2018-04-30T11:57:57.000Z
tags:
  - git
  - devops
---

<!--kg-card-begin: markdown--><ol>
<li>
<p>Install <code>gpg</code> using Homebrew: <code>brew install gpg</code>.</p>
</li>
<li>
<p>Follow the <a href="https://help.github.com/articles/generating-a-new-gpg-key/">GitHub guide</a> to generate a new gpg key.</p>
</li>
<li>
<p>Add the gpg key <a href="https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/">to your GitHub account</a>.</p>
</li>
<li>
<p>Get around <a href="https://github.com/keybase/keybase-issues/issues/2798">this issue</a> by doing the following <code>echo  'export GPG_TTY=$(tty)' &gt;&gt; ~/.bash_profile</code></p>
</li>
<li>
<p>Reload <code>.bash_profile</code> by running <code>source ~/.bash_profile</code></p>
</li>
<li>
<p>Test that gpg works through <code>echo &quot;test&quot; | gpg --clearsign</code></p>
</li>
<li>
<p>(Optional) If you want to enable signing on every commit <code>git config --global commit.gpgsign true</code></p>
</li>
<li>
<p>Test a commit. You need to provide the <code>-S</code> flag if you didn't do step 7: <code>git commit -S -m &quot;This is a signed commit&quot;</code></p>
</li>
</ol>
<p><img src="__GHOST_URL__/content/images/2018/04/signed-commit.png" alt="" loading="lazy"></p>
<!--kg-card-end: markdown-->
