#!/bin/sh

BASEDIR=$(dirname $0)

RADA=$BASEDIR/morfyhestaja/konverter
RADAMRF=$BASEDIR/morfyhestaja/vabamorf/apps/cmdline/project/unix
RADADCT=$BASEDIR/morfyhestaja/vabamorf/dct

cat $1 | $RADA/rlausestaja.pl 

