####To preview local changes you make before pushing:
You can't just open the `.html` file in the browser because `_layouts/default.html` is the actual page being loaded.

1. In `_layouts/default.html`, replace `{{ content }}` with the entire file content of the `.html` file you're making edits to (ex. `cellgroups.html`)
2. Open `_layouts/default.html` in a browser.
3. Make sure it looks OK and then revert `_layouts/default.html` back to normal.
