#!/bin/bash
mkdir -p admin-53851
cd admin-53851
cat <<EOF >> Main.java


import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try{
			Scanner in = new Scanner(System.in);
			int n = in.nextInt();
			int[] a = new int[n];
			for(int i = 0;i < n; i++)
				a[i] = in.nextInt();
			
			in.close();
			int S = a[0];
			int ans = S;
			for(int i = 1; i < n; i++){
				if(S > 0){
					S = S + a[i];
				}else{
					S = a[i];
				}
				if(ans < S) ans = S;
			}
			System.out.print(ans);
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}

EOF
javac Main.java
FILE=Main.class
if test -f "$FILE"; then
  echo Successful
else
  echo Compile Error
fi
cd .. 
rm -rf admin-53851 & 
rm -rf admin-53851.sh & 
