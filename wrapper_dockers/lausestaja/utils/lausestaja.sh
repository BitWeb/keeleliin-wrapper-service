#!/bin/sh

BASEDIR=$(dirname $0)
RADA=$BASEDIR/morfyhestaja/konverter

cat $1 | $RADA/rlausestaja.pl 

