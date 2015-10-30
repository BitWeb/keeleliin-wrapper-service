#!/bin/sh

BASEDIR=$(dirname $0)

RADA=$BASEDIR/konverter
RADAMRF=$BASEDIR/vabamorf/apps/cmdline/project/unix
RADADCT=$BASEDIR/vabamorf/dct

cat $1 | $RADA/wr2json.pl | $RADAMRF/etana analyze -lex $RADADCT/et.dct -guess | $RADA/json2mrf.pl

