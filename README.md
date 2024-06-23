# Latex shortcuts chrome extension
Shortcuts Implemented:
- `\beg` expand to `\begin{} \end{}`, 
places cursor inside, 
copies content from `\begin{envname}` -> `\end{envname}` include deletion (editing envname in \end does nothing)
- Auto complete `{` to `{}` and place cursor inside


- [ ] add intellisense features
- include 


## Build
Build with webpack
```
yarn build
```

Load unpacked chrome extension:
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world

Note only works in chrome based notion, recommend to add it as an app through chrome (e.g. on mac) to allow using shortcuts everywhere.

