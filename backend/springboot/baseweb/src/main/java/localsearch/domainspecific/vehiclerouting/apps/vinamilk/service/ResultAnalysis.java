package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;

import localsearch.domainspecific.vehiclerouting.vrp.utils.ScannerInput;

public class ResultAnalysis {
	public ResultAnalysis() {
		
	}
	
	public void readOutputTunningFile() {
		double[] lowerRemovals = {0.1, 0.2};
		double[] upperRemovals = {0.3, 0.4};
		int[] sig1_list = {3, 5, 10};
		int[] sig2_list = {0, 1};
		int[] sig3_list = {-1, -3, -10};
		
		String dir = "F:\\Project\\paper-vinamilk\\VNM-paper-latex\\experiments\\problem 3\\parameterTuning\\";
		String fileName = "VNM-HCM-orders-2019-09-21";
		String summaryFile = dir + "parameterTuningSumary.txt";
		
		try{
			FileOutputStream write = new FileOutputStream(summaryFile);
			PrintWriter fo = new PrintWriter(write);
			fo.println("======tunning parameter result=====");
			fo.println("lowerRate-upperRate-sigma1-sigma2-sigma3-cost-nbServedReqs-nbVehicles");
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
		double bestCost = Double.MAX_VALUE;
		int bestNbVehicles = 1000000;
		int bestNbServedReqs = -1;
		double bestLower = -1;
		double bestUpper = -1;
		int bestSigma1 = -1;
		int bestSigma2 = -1;
		int bestSigma3 = -1;
		
		for(int lb = 0; lb < lowerRemovals.length; lb++){
			for(int ub = 0; ub < upperRemovals.length; ub++){
				for(int s1 = 0; s1 < sig1_list.length; s1++){
					for(int s2 = 0; s2 < sig2_list.length; s2++){
						for(int s3 = 0; s3 < sig3_list.length; s3++){
							try{
								String tunningFile = dir + fileName + "_" 
										+ (int)(lowerRemovals[lb]*267) + "_" + (int)(upperRemovals[ub]*267) + "_" 
										+ sig1_list[s1] + "_" + sig2_list[s2] + "_" + sig3_list[s3]
										+ ".txt";
								
								ScannerInput sc = new ScannerInput(tunningFile);
								String str = "";
								
								while(str != null){
									str = sc.readLine();
									if(str.equals("ALNS-RunTime-Objective-NbServedCustomers-NbUsedVehicles")) {
										str = sc.readLine();
										String[] r = str.split("-");
										double cost = Double.parseDouble(r[1]);
										int nbServedReqs = Integer.parseInt(r[2]);
										int nbVehicles = Integer.parseInt(r[3]);
										if(nbServedReqs > bestNbServedReqs
											|| (nbServedReqs == bestNbServedReqs && nbVehicles < bestNbVehicles)
											|| (nbServedReqs == bestNbServedReqs && nbVehicles == bestNbVehicles
													&& cost < bestCost)) {
											bestNbServedReqs = nbServedReqs;
											bestCost = cost;
											bestNbVehicles = nbVehicles;
											bestLower = lowerRemovals[lb];
											bestUpper = upperRemovals[ub];
											bestSigma1 = sig1_list[s1];
											bestSigma2 = sig2_list[s2];
											bestSigma3 = sig3_list[s3];
										}
										try{
											FileOutputStream write = new FileOutputStream(summaryFile, true);
											PrintWriter fo = new PrintWriter(write);
											fo.println(lowerRemovals[lb] + " & " + upperRemovals[ub] + " & " 
													+ sig1_list[s1] + " & " + sig2_list[s2] + " & " + sig3_list[s3]
													+ " & " + cost + " & " + nbServedReqs + " & " + nbVehicles + " \\\\");
											fo.close();
										}catch(Exception e){
											System.out.println(e);
										}
										sc.close();
										break;
									}
								}
								
							}catch(Exception e){
								System.out.println(e);
							}
						}
					}
				}
			}
		}
		try{
			FileOutputStream write = new FileOutputStream(summaryFile, true);
			PrintWriter fo = new PrintWriter(write);
			fo.println("========Best result=========");
			fo.println(bestLower + " " + bestUpper + " " 
					+ bestSigma1 + " " + bestSigma2 + " " + bestSigma3
					+ " " + bestCost + " " + bestNbServedReqs + " " + bestNbVehicles);
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
						
	}
	
	public void readComparisonInitSolutions() {
		String dir = "F:\\Project\\paper-vinamilk\\VNM-paper-latex\\experiments\\problem 2\\comparisonInitAlgorithms\\";
		String[] fileNameList = {
				"VNM-HCM-orders-2019-09-09",
				"VNM-HCM-orders-2019-09-10",
				"VNM-HCM-orders-2019-09-11",
				"VNM-HCM-orders-2019-09-12",
				"VNM-HCM-orders-2019-09-13",
				"VNM-HCM-orders-2019-09-14",
				"VNM-HCM-orders-2019-09-16",
				"VNM-HCM-orders-2019-09-17",
				"VNM-HCM-orders-2019-09-18",
				"VNM-HCM-orders-2019-09-19",
				"VNM-HCM-orders-2019-09-20",
				"VNM-HCM-orders-2019-09-21"};
		String summaryFile = dir + "comparisonInitSolutionSummary.txt";
		try{
			FileOutputStream write = new FileOutputStream(summaryFile);
			PrintWriter fo = new PrintWriter(write);
			fo.println("======comparison init solution=====");
			fo.println("#Reqs--(gr--gv--gc--t)--(gr--gv--gc--t)--(gr--gv--gc--t)");
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
		
		for(int t = 0; t < fileNameList.length; t++) {			
			int nReqs = 0;
			String[] typeOfInit = {"vSA", "vSW", "vGIA"};
			double bestCost = Double.MAX_VALUE;
			int bestNbVehicles = 1000000;
			int bestNbServedReqs = -1;
			int bestType = -1;
			String line = "";
			for(int k = 0; k < typeOfInit.length; k++) {
				try{
					String resultFile = dir + fileNameList[t] + "-"  + typeOfInit[k] + ".txt";
					
					ScannerInput sc = new ScannerInput(resultFile);
					String str = "";
				
					while(str != null){
						str = sc.readLine();
						if(str.contains("Starting time")) {
							String[]  r = str.split(",");
							r = r[1].split("=");
							nReqs = Integer.parseInt(r[1].trim());
						}
						if(str.equals("ALNS-RunTime-Objective-NbServedCustomers-NbUsedVehicles")) {
							str = sc.readLine();
							String[] r = str.split("-");
							double time = Double.parseDouble(r[0]);
							double cost = Double.parseDouble(r[1]);
							int nbServedReqs = Integer.parseInt(r[2]);
							int nbVehicles = Integer.parseInt(r[3]);
							if(nbServedReqs > bestNbServedReqs
								|| (nbServedReqs == bestNbServedReqs && nbVehicles < bestNbVehicles)
								|| (nbServedReqs == bestNbServedReqs && nbVehicles == bestNbVehicles
										&& cost < bestCost)) {
								bestNbServedReqs = nbServedReqs;
								bestCost = cost;
								bestNbVehicles = nbVehicles;
								bestType = k;
							}
							line += " & " + (nReqs - nbServedReqs) + " & " + nbVehicles + " & " + cost + " & " + time;
							break;
						}
					}
					
				}catch(Exception e){
					System.out.println(e);
				}
			}
			try{
				FileOutputStream write = new FileOutputStream(summaryFile, true);
				PrintWriter fo = new PrintWriter(write);
				double gap = (double)bestNbServedReqs*100/nReqs;
				fo.println(fileNameList[t] + " & " + nReqs + line + " & " + bestType + " & " + gap + " \\\\");
				fo.close();
			}catch(Exception e){
				System.out.println(e);
			}
		}		
	}
	
	public void readOutputForEvaluateRemovalOperators(){
		String dir = "F:\\Project\\paper-vinamilk\\VNM-paper-latex\\experiments\\problem 3\\iterators\\";
		String summariseFile = dir + "summarise-RM-operators.txt";
		
		try{
			FileOutputStream write = new FileOutputStream(summariseFile);
			PrintWriter fo = new PrintWriter(write);
			fo.println("Iters cost cost cost ...");
			
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
		
		int nbIters = 10;
		String fileName = "VNM-HCM-orders-2019-09-21";
		String s = "";
		
		for(int i = 0; i < 8; i++) {
			s += "x" + i + " = [";
			
			ArrayList<Integer> cost_REM = new ArrayList<Integer>();
			
			for(int k = 0; k < nbIters; k++){								
				String outputREMfileTxt = dir + fileName + "-RM-" + i +"-IT-" + k + ".txt";
				
				ScannerInput sc = new ScannerInput(outputREMfileTxt);
				
				String str = "";
				while(str != null){
					str = sc.readLine();
					if(str.contains("ALNS-RunTime-Objective-NbServedCustomers-NbUsedVehicles")){
						str = sc.readLine();
						String[] brLine = str.split("-");
						int cost_int = Integer.parseInt(brLine[2]);
						cost_REM.add(cost_int);
						break;
					}	
				}
				sc.close();
			}
			
			for(int k = 0; k < cost_REM.size(); k++){
				if(k != cost_REM.size() - 1)
					s += cost_REM.get(k) + "; ";
				else
					s += cost_REM.get(k) + "];" + "\n";
			}
		}

		try{
			FileOutputStream write = new FileOutputStream(summariseFile, true);
			PrintWriter fo = new PrintWriter(write);
			fo.println(s);
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
	}
	
	public void readOutputForEvaluateInsertionOperators(){
		String dir = "F:\\Project\\paper-vinamilk\\VNM-paper-latex\\experiments\\problem 3\\iterators\\";
		String summariseFile = dir + "summarise-IS-operators.txt";
		
		try{
			FileOutputStream write = new FileOutputStream(summariseFile);
			PrintWriter fo = new PrintWriter(write);
			fo.println("Iters cost cost cost ...");
			
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
		
		int nbIters = 10;
		String fileName = "VNM-HCM-orders-2019-09-21";
		String s = "";
		
		for(int i = 0; i < 8; i++) {
			s += "x" + i + " = [";
			
			ArrayList<Integer> cost_REM = new ArrayList<Integer>();
			
			for(int k = 0; k < nbIters; k++){								
				String outputREMfileTxt = dir + fileName + "-IS-" + i +"-IT-" + k + ".txt";
				
				ScannerInput sc = new ScannerInput(outputREMfileTxt);
				
				String str = "";
				while(str != null){
					str = sc.readLine();
					if(str.contains("ALNS-RunTime-Objective-NbServedCustomers-NbUsedVehicles")){
						str = sc.readLine();
						String[] brLine = str.split("-");
						int cost_int = (int)Double.parseDouble(brLine[1]);
						cost_REM.add(cost_int);
						break;
					}	
				}
				sc.close();
			}
			
			for(int k = 0; k < cost_REM.size(); k++){
				if(k != cost_REM.size() - 1)
					s += cost_REM.get(k) + "; ";
				else
					s += cost_REM.get(k) + "];" + "\n";
			}
		}

		try{
			FileOutputStream write = new FileOutputStream(summariseFile, true);
			PrintWriter fo = new PrintWriter(write);
			fo.println(s);
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
	}
	
	public double calculateSTDEV(ArrayList<Integer> arr){
		int sum = 0;
		for(int i = 0; i < arr.size(); i++)
			sum += arr.get(i);
		double mean = sum/arr.size();
		
        double dv = 0;
        for(int i = 0; i < arr.size(); i++){
            double dm = arr.get(i) - mean;
            dv += dm * dm;
        }
        return Math.sqrt(dv / arr.size());
	}
	
	public double calculateMeanInt(ArrayList<Integer> arr){
		int sum = 0;
		for(int i = 0; i < arr.size(); i++)
			sum += arr.get(i);
		return (double)(sum/arr.size());
	}
	
	public double calculateMean(ArrayList<Double> arr){
		double sum = 0;
		for(int i = 0; i < arr.size(); i++)
			sum += arr.get(i);
		return (double)(sum/arr.size());
	}
	
	public int getMax(ArrayList<Integer> arr){
		int max = Integer.MIN_VALUE;
		for(int i = 0; i < arr.size(); i++)
			if(max < arr.get(i))
				max = arr.get(i);
		return max;
	}
	public int getMin(ArrayList<Integer> arr){
		int min = Integer.MAX_VALUE;
		for(int i = 0; i < arr.size(); i++)
			if(min > arr.get(i))
				min = arr.get(i);
		return min;
	}
	
	public void readALNSSolutionForSumary() {
		String dir = "F:\\Project\\paper-vinamilk\\VNM-paper-latex\\experiments\\problem 3\\alnsForEachInstances\\";
		String[] fileNameList = {
				"VNM-HCM-orders-2019-09-09",
				"VNM-HCM-orders-2019-09-10",
				"VNM-HCM-orders-2019-09-11",
				"VNM-HCM-orders-2019-09-12",
				"VNM-HCM-orders-2019-09-13",
				"VNM-HCM-orders-2019-09-14",
				"VNM-HCM-orders-2019-09-16",
				"VNM-HCM-orders-2019-09-17",
				"VNM-HCM-orders-2019-09-18",
				"VNM-HCM-orders-2019-09-19",
				"VNM-HCM-orders-2019-09-20",
				"VNM-HCM-orders-2019-09-21"};
		String summaryFile = dir + "ALNSsolutionSummary.txt";
		try{
			FileOutputStream write = new FileOutputStream(summaryFile);
			PrintWriter fo = new PrintWriter(write);
			fo.println("======alns solution=====");
			fo.println("Ins & #Reqs & mingr & maxgr & avggr & stdevgr & avggv & avfgc");
			fo.close();
		}catch(Exception e){
			System.out.println(e);
		}
		
		for(int t = 0; t < fileNameList.length; t++) {		
			int nReqs = 0;
			ArrayList<Integer> nbServedRequests = new ArrayList<Integer>();
			ArrayList<Integer> nbUsedVehicles = new ArrayList<Integer>();
			ArrayList<Double> costs = new ArrayList<Double>();
			String line = "";
			for(int i = 0; i < 10; i++) {
				try{
					String resultFile = dir + fileNameList[t] + "-IT-"  + i + ".txt";
					
					ScannerInput sc = new ScannerInput(resultFile);
					String str = "";
					try
					{
						File temp = new File(resultFile);
						if(!temp.exists())
							continue;
					} catch (Exception e){
						e.printStackTrace();
					}
					while(str != null){
						str = sc.readLine();
						if(str.contains("Starting time")) {
							String[]  r = str.split(",");
							r = r[1].split("=");
							nReqs = Integer.parseInt(r[1].trim());
						}
						if(str.equals("ALNS-RunTime-Objective-NbServedCustomers-NbUsedVehicles")) {
							str = sc.readLine();
							String[] r = str.split("-");
							double time = Double.parseDouble(r[0]);
							double cost = Double.parseDouble(r[1]);
							int nbServedReqs = nReqs - Integer.parseInt(r[2]);
							int nbVehicles = Integer.parseInt(r[3]);
							nbServedRequests.add(nbServedReqs);
							nbUsedVehicles.add(nbVehicles);
							costs.add(cost);
							break;
						}
					}
					
				}catch(Exception e){
					System.out.println(e);
				}
			}
			
			line += fileNameList[t] + " & " +  nReqs + " & " + getMin(nbServedRequests) + " & "
					+ getMax(nbServedRequests) + " & " + calculateMeanInt(nbServedRequests) + " & "
					+ calculateSTDEV(nbServedRequests) + " & " + calculateMeanInt(nbUsedVehicles)
					+ " & " + calculateMean(costs) + " & & & \\\\";
			try{
				FileOutputStream write = new FileOutputStream(summaryFile, true);
				PrintWriter fo = new PrintWriter(write);
				fo.println(line);
				fo.close();
			}catch(Exception e){
				System.out.println(e);
			}
		}		
	}
	
	public static void main(String[] args) {
		ResultAnalysis ra = new ResultAnalysis();
		//ra.readOutputTunningFile();
		//ra.readComparisonInitSolutions();
		//ra.readOutputForEvaluateRemovalOperators();
		ra.readOutputForEvaluateInsertionOperators();
		//ra.readALNSSolutionForSumary();
		
	}
}
