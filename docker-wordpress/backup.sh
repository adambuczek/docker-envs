#!/bin/bash
#
# WodrPress backup script for MySQL based instalations
#  This script backups a copy of wp-content folder excluding hidden files and dirs
#

set -e # exit on every error

# Extract string that starts with ARG and ends with next semicolon
function extract {
  grep -Eo "$1[^;]+" | sed "s/$1//g"
}

# Customize paths
BACKUPDIR=`pwd`
WPPATH='../htdocs/'
WPCONFIG='../wp-config.php'

# Customize names
DIR='wp-content'
ARCHIVE="$DIR.bak.tar"

# extract WP DB Settings
DB_CONFIG=`cat "$WPCONFIG" | grep -Eo "\('(DB[^']+)',\s+?'([^']+)'\);" | sed "s/[' (),]//g"`
DB_USER=`echo $DB_CONFIG | extract DB_USER`
DB_PASS=`echo $DB_CONFIG | extract DB_PASSWORD`
DB_NAME=`echo $DB_CONFIG | extract DB_NAME`

#echo $DB_CONFIG
#echo $DB_USER
#echo $DB_PASS
#echo $DB_NAME

# Go to WPPATH but create the archive right here
cd $WPPATH
tar -cvhf "$BACKUPDIR/$ARCHIVE" "$DIR" --hard-dereference
cd $BACKUPDIR

# Dump the database
mysqldump -u $DB_USER -p$DB_PASS --databases $DB_NAME > database.bak.sql

# add db dump to the archive
tar -rvf "$ARCHIVE" database.bak.sql
rm database.bak.sql

# gzip the archive
gzip -vf1 "$ARCHIVE"
chown -Rv admin:admin ./

# if we made it here we don't need the log
# rm log
