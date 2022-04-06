package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;

import java.io.File;
import java.io.PrintWriter;
import localsearch.domainspecific.vehiclerouting.vrp.utils.ScannerInput;

public class SolomonData2MIPMDMTVRP {
	int nParkings;
	int nDepots;
	int nVehicle;
	int nCustomers;
	int nProducts;
	int nPoints;
	int capacity;
	int[] xcoors;
	int[] ycoors;
	int[] demands;
	int[] earliestArrivalTime;
	int[] latestArrivalTime;
	int[] serviceTime;
	
	public SolomonData2MIPMDMTVRP() {
		
	}
	
	public void readSolomonFile(String inFile) {
		try{
			ScannerInput sc = new ScannerInput(inFile);
			String str = sc.readLine();
			str = sc.readLine();
			str = sc.readLine();
			str = sc.readLine();
			str = sc.readLine();
			str = str.replaceAll("\\s{2,}", " ").trim();
			String[] s = str.split(" ");
			capacity =  Integer.parseInt(s[1]);
			str = sc.readLine();
			str = sc.readLine();
			str = sc.readLine();
			str = sc.readLine();
			
			xcoors = new int[nPoints];
			ycoors = new int[nPoints];
			demands = new int[nPoints];
			earliestArrivalTime = new int[nPoints];
			latestArrivalTime = new int[nPoints];
			serviceTime = new int[nPoints];
			int i = 0;
			while(str != null && i < nPoints){
				str = sc.readLine();
				str = str.replaceAll("\\s{2,}", " ").trim();
				s = str.split(" ");
				xcoors[i] = Integer.parseInt(s[1]);
				ycoors[i] = Integer.parseInt(s[2]);
				demands[i] = Integer.parseInt(s[3]);
				earliestArrivalTime[i] = Integer.parseInt(s[4]);
				latestArrivalTime[i] = Integer.parseInt(s[5]);
				serviceTime[i] = Integer.parseInt(s[6]);
				if(i==0) {
					i++;
					xcoors[i] = Integer.parseInt(s[1]);
					ycoors[i] = Integer.parseInt(s[2]);
					demands[i] = Integer.parseInt(s[3]);
					earliestArrivalTime[i] = Integer.parseInt(s[4]);
					latestArrivalTime[i] = Integer.parseInt(s[5]);
					serviceTime[i] = Integer.parseInt(s[6]);
				}
				i++;
			}
		}catch(Exception e){
			System.out.println(e);
		}
		
	}
	
	public void createFileToMIP(String outFile) {

		int nPoints = nCustomers + nDepots + nParkings;
		try {
			PrintWriter f = new PrintWriter(new File(outFile));
			f.println("#nbCustomers");
			f.println(nCustomers);
			
			f.println("#nbParkings");
			f.println(nParkings);
			
			f.println("#nbCentralDepots");
			f.println(nDepots);
			
			f.println("#nbVehicles");
			f.println(nVehicle);
			
			f.println("#nbProducts");
			f.println(nProducts);
			
			f.println("#parking info (nk ep lp)");
			for(int i = 0; i < nParkings; i++) {
				f.println(nVehicle + " " + earliestArrivalTime[0] + " " + latestArrivalTime[0]);
			}

			f.println("#central depot info(ed, ld, waittingTime, loadingTimeperUnit)");
			for(int i = 0; i < nDepots; i++) {
				f.println(earliestArrivalTime[0] + " " + latestArrivalTime[0]
					+ " " + serviceTime[0] + " 0");
			}
			f.println("#vehicle info(ek, lk, ck lower, ck upper, qk, costRate)");
			for(int i = 0; i < nVehicle; i++) {
				f.println(earliestArrivalTime[0] + " " + latestArrivalTime[0] + " 0 "
					+ capacity + " 1 1");
			}
			
			f.println("#weight of products (wp)");
			for(int i = 0; i < nProducts; i++)
				f.println("1");
			
			f.println("#customer demand (quantity, quantity, quantity,... nbProducts)");
			for(int i = nDepots + nParkings; i < nPoints; i++) {
				f.println(demands[i]);
			}
			
			f.println("#customer info(ei, li, waittingTime, unloadingTimePerUnit)");
			for(int i = nDepots + nParkings; i < nPoints; i++) {
				f.println(earliestArrivalTime[i] + " " + latestArrivalTime[i] + " " + serviceTime[i] +" 0");
			}
			
			f.println("#vehicle - product (restrictly bkp) = 1: vh can carry");
			for(int i = 0; i < nVehicle; i++) {
				String s = "";
				for(int j = 0; j < nProducts-1; j++) {
					s += "1 ";
				}
				s += "1";
				f.println(s);
			}
			f.println("#vehicles - customer (restrictly rki) = 1: vh can go to cus");
			for(int i = 0; i < nVehicle; i++) {
				String s = "";
				for(int k = 0; k < nCustomers - 1; k++) {
					s += "1 ";
				}
				s += "1";
				f.println(s);
			}
			
			f.println("#vehicle - remain customers = 1: remain");
			for(int i = 0; i < nVehicle; i++) {
				String s = "";
				for(int k = 0; k < nCustomers - 1; k++) {
					s += "0 ";
				}
				s += "0";
				f.println(s);
			}
			
			f.println("#travel time matrix:[from to travelTime]");
			f.println(nPoints * nPoints);
			for(int i = 0; i < nPoints; i++)
				for(int j = 0; j < nPoints; j++) {
					double p = Math.pow(xcoors[j] - xcoors[i], 2) + Math.pow(ycoors[j] - ycoors[i], 2);
					double d = Math.sqrt(p);
					int d1 = (int)(d*10);
					double dr = (double)((double)d1/10);
					f.println(i + " " + j + " " + dr);
				}
			f.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	public static void main(String[] args) {
		SolomonData2MIPMDMTVRP cv = new SolomonData2MIPMDMTVRP();
		String dir = "data\\vinamilk\\benchmarkData\\Solomon\\";
		String ins = "r202";
		String inFile = dir + ins + ".txt";
		
		cv.nCustomers = 100;
		cv.nParkings = 1;
		cv.nDepots = 1;
		cv.nVehicle = 6;
		cv.nProducts = 1;
		cv.nPoints = cv.nCustomers + cv.nDepots + cv.nParkings;

		cv.readSolomonFile(inFile);
		String outFile = dir + ins + "-" + cv.nCustomers + "-MILP.txt";
		cv.createFileToMIP(outFile);
		
	}
}
