#!/bin/sh

deno fmt
deno run --allow-run --allow-write main.ts && deno fmt out.js && cat out.js
