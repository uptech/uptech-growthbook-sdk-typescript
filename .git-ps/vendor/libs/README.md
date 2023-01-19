# project-shell-libs

Collection of various shell libs that we use with our various projects to facilate scripting, especially when creating git-ps-rs hooks.

Run the following to initially setup the project shell library directory structure.

```
mkdir -p .git-ps/vendor
```

Run the following to install/update the project shell libraries and git-ps-rs hook examples.

```
rm -rf .git-ps/vendor/libs && git clone --depth 1 git@github.com:uptech/project-shell-libs.git .git-ps/vendor/libs && rm -rf .git-ps/vendor/libs/.git
```
