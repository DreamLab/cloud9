#!/bin/bash

cd `dirname $0`

cd ../support/jsdav
npm install

cd ../../bin
cd ../
npm install core
npm install dl
