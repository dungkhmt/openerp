#!/bin/bash
mkdir -p admin-34614
cd admin-34614
cat <<EOF >> main.cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
  int a,b;
  cin >> a >> b;
  int c = a + b;
  cout << c;
  return 0;
}
EOF
g++ -o main main.cpp
FILE=main
if test -f "$FILE"; then
  echo Successful
else
  echo Compile Error
fi
cd .. 
rm -rf admin-34614 & 
rm -rf admin-34614.sh & 
