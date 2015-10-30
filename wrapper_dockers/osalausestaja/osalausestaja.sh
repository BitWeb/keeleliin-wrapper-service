#!/bin/sh

BASEDIR=$(dirname $0)

cd $BASEDIR
cd CGParser

RADA=./

cat $1 | $RADA/rtolkija.pl | $RADA/tpron.pl | $RADA/tcopyremover.pl |awk -f $RADA/TTRELLID.AWK | $RADA/tagger09 $RADA/abileksikon06utf.lx stdin stdout | $RADA/tcopyremover.pl | $RADA/tkms2cg3.pl | vislcg3 -o -g $RADA/clo.rul 

