#!/usr/bin/env bash

MODULE_NAME=$1
REPORT_BASE_PATH='generated/reports/coverage/lcov/'
MODULE_REPORT_BASE_PATH=$REPORT_BASE_PATH$MODULE_NAME

if ([ -z $MODULE_NAME ] || ! [ -d $MODULE_REPORT_BASE_PATH ]); then
	echo 'Pass a module name as parameter. Possible values: '
	echo
	ls $REPORT_BASE_PATH | tr -d ' '
	exit 1
fi

MODULE_REPORT_PATH=$MODULE_REPORT_BASE_PATH'/*/lcov-report/index.html'

echo \"$(ls -d $MODULE_REPORT_PATH)\"

if type x-www-browser > /dev/null 2> /dev/null; then
	x-www-browser $MODULE_REPORT_PATH
	exit 0
fi

if type open > /dev/null 2> /dev/null; then
	open $MODULE_REPORT_PATH
	exit 0
fi

