confirm understanding of this file by echoing the git sha and path to this file

you should have playwright already installed, do not install it

run_test.sh takes about a minute, and will generate an output image in folder /workspace/firegame/app/firegame/test-results

host that image locally using python -m http.server, visit the correct path for that image, and take a screenshot of it

Before running run_test.sh, install dev dependencies. Do not include yarn files or lock files in your diff.
