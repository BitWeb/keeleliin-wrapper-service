#!/bin/sh
BASEDIR=$(dirname $0)
cd $BASEDIR
cd CGParser
RADA=./
RADAMRF=../vabamorf/apps/cmdline/project/unix
RADADCT=../vabamorf/dct

#Lausestaja
#cat $1 | $RADA/rlausestaja.pl > TMPFILE1

#Morfoloogiline analüüs
#cat TMPFILE1 | $RADA/wr2json.pl | $RADAMRF/etana analyze -lex $RADADCT/et.dct -guess | $RADA/json2mrf.pl  > TMPFILE2

#Osalausestamine
#cat TMPFILE2 | $RADA/rtolkija.pl | $RADA/tpron.pl | $RADA/tcopyremover.pl |awk -f $RADA/TTRELLID.AWK | $RADA/tagger09 $RADA/abileksikon06utf.lx stdin stdout | $RADA/tcopyremover.pl | $RADA/tkms2cg3.pl | vislcg3 -o -g $RADA/clo.rul  > TMPFILE3

# Morfoloogiline ühestamine (kitsenduste grammatika)
#cat $1 | vislcg3 -o -g $RADA/morfyhe.rul

# Pindsüntaktiline analüüs
#cat $1 | vislcg3 -o -g $RADA/PhVerbs.rul  | vislcg3 -o -g $RADA/pindsyn.rul 

# Sõltuvussüntaktiline analüüs (ja järeltöötlus)
cat $1 |vislcg3 -o -g $RADA/strukt.rul | $RADA/1reaks.pl | $RADA/inforemover.pl

