package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

import com.google.gson.Gson;

import gurobi.*;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Customer;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Distance;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.DistributionCenter;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.MDMTPInput;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Order;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Parking;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Product;
import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Vehicle;


public class MIPmodelSameTruckTrailer {
	Set<Integer> truckPoints;
	
	Set<Integer> customerPoints;
	Set<Integer> centralDepots;
	Set<Integer> visitedPoints;
	
	int nbProducts;
	double[] weightProducts;
	
	int nbCustomers;
	double[][] demands;
	int[] earliestArrivalTime;
	int[] latestArrivalTime;
	int[] waitingDuration;
	double[] durationTimeUnit;
	double[] serviceDuration;
	
	int nbParkings;
	int[] nbVehiclesAtParking;
	ArrayList<Integer> parkings;
	HashMap<Integer, Integer> vh2parking;
	
	int nbCentralDepots;
	//ArrayList<Integer> depots;
	
	int nbVehicles;
	int[] vhStartWorkingTime;
	int[] vhEndWorkingTime;
	double[] vhLowerCapacity;
	double[] vhUpperCapacity;
	int[] vhNbTours;
	double[] vhAddingCostRate;
	
	int[][] vhRestrictProducts;
	int[][] vhRestrictCustomers;
	int[][] vhRemainCustomers;
	
	double[][] travelTime;	
	
	ArrayList<GRBVar> X;//xe k di tu i  den j trong chuyen q
	HashMap<String, GRBVar> arc2X;
	
	ArrayList<GRBVar> Y;//req i duoc phuc vu hay ko
	HashMap<String, GRBVar> arc2Y;
	
	ArrayList<GRBVar> L;//so luong hang p load len xe k trong chuyen q tai depot
	HashMap<String, GRBVar> arc2L;
	
	
	ArrayList<GRBVar> Z;
	HashMap<String, GRBVar> arc2Z;
	
	ArrayList<GRBVar> W;
	HashMap<String, GRBVar> point2W;
	
	ArrayList<GRBVar> arrivalTime;
	ArrayList<GRBVar> departureTime;
	ArrayList<GRBVar> startServiceTime;
	HashMap<String, GRBVar> point2ArrivalTime;
	HashMap<String, GRBVar> point2DepartureTime;
	HashMap<String, GRBVar> point2StartServiceTime;
	
	ArrayList<GRBVar> servingTimeAtPoint;
	HashMap<String, GRBVar> point2servingTimeAtPoint;
	
	ArrayList<GRBVar> arrivalTimeDepot;
	ArrayList<GRBVar> returnTimeDepot;
	ArrayList<GRBVar> departureTimeDepot;
	ArrayList<GRBVar> startServiceTimeDepot;
	HashMap<String, GRBVar> point2ArrivalTimeDepot;
	HashMap<String, GRBVar> point2returnTimeDepot;
	HashMap<String, GRBVar> point2DepartureTimeDepot;
	HashMap<String, GRBVar> point2StartServiceTimeDepot;
	
	HashSet<ArrayList<Integer>> arcVehicles;
	HashMap<Integer, HashSet<Integer>> inArcVehicles;
	HashMap<Integer, HashSet<Integer>> outArcVehicles;
	
	GRBVar y0;
	GRBVar y1;
	
	int a = 100;
	int M = 0;
	
	double Max_Distance = -1;

	public MDMTPInput input;
	
	public MIPmodelSameTruckTrailer(){
	}
	
	public void readData(String fn){
		truckPoints = new HashSet<Integer>();
		visitedPoints = new HashSet<Integer>();
		customerPoints = new HashSet<Integer>();
		centralDepots = new HashSet<Integer>();
		parkings = new ArrayList<Integer>();
		
		int id = 0;
		
		try{
			Scanner sc = new Scanner(new File(fn));
			while(sc.hasNextLine()){
				String[] str;
				System.out.println(sc.nextLine());
				nbCustomers = Integer.parseInt(sc.nextLine());
				
				sc.nextLine();
				nbParkings = Integer.parseInt(sc.nextLine());
				
				sc.nextLine();
				nbCentralDepots = Integer.parseInt(sc.nextLine());
				
				sc.nextLine();
				nbVehicles = Integer.parseInt(sc.nextLine());
				
				sc.nextLine();
				nbProducts = Integer.parseInt(sc.nextLine());
				
				sc.nextLine();
				nbVehiclesAtParking	= new int[nbParkings];
				earliestArrivalTime = new int[nbCustomers+nbParkings+nbCentralDepots];
				latestArrivalTime 	= new int[nbCustomers+nbParkings+nbCentralDepots];
				waitingDuration		= new int[nbCustomers+nbParkings+nbCentralDepots];
				durationTimeUnit 	= new double[nbCustomers+nbParkings+nbCentralDepots];
				
				for(int i = 0; i < nbParkings; i++){
					str = sc.nextLine().split(" ");
					nbVehiclesAtParking[id] = Integer.parseInt(str[0]);
					earliestArrivalTime[id] = Integer.parseInt(str[1]);
					latestArrivalTime[id] = Integer.parseInt(str[2]);
					waitingDuration[id] = 0;
					durationTimeUnit[id] = 0;
					truckPoints.add(id);
					parkings.add(id);
					id++;
				}
				
				sc.nextLine();
				
				
				//depots = new ArrayList<Integer>();
				for(int i = 0; i < nbCentralDepots; i++){
					str = sc.nextLine().split(" ");
					truckPoints.add(id);
					//depots.add(id);
					centralDepots.add(id);
					visitedPoints.add(id);
					earliestArrivalTime[id] = Integer.parseInt(str[0]);
					latestArrivalTime[id] = Integer.parseInt(str[1]);
					waitingDuration[id] = Integer.parseInt(str[2]);
					durationTimeUnit[id] = Double.parseDouble(str[3]);
					if(M < latestArrivalTime[id])
						M = latestArrivalTime[id];
					id++;
					
				}
				
				sc.nextLine();
				vhStartWorkingTime = new int[nbVehicles];
				vhEndWorkingTime = new int[nbVehicles];
				vhLowerCapacity = new double[nbVehicles];
				vhUpperCapacity = new double[nbVehicles];
				vhNbTours = new int[nbVehicles];
				vh2parking = new HashMap<Integer, Integer>();
				vhAddingCostRate = new double[nbVehicles];
				
				int k = 0;
				for(int i = 0; i < nbParkings; i++){
					for(int j = 0; j < nbVehiclesAtParking[i]; j++){
						str = sc.nextLine().split(" ");
						vhStartWorkingTime[k] = Integer.parseInt(str[0]);
						vhEndWorkingTime[k] = Integer.parseInt(str[1]);
						vhLowerCapacity[k] = Double.parseDouble(str[2]);
						vhUpperCapacity[k] = Double.parseDouble(str[3]);
						vhNbTours[k] = Integer.parseInt(str[4]);
						vhAddingCostRate[k] = Double.parseDouble(str[5]);
						vh2parking.put(k, i);
						k++;
					}
				}
			
				sc.nextLine();
				weightProducts = new double[nbProducts];
				for(int i = 0; i < nbProducts; i++)
					weightProducts[i] = Double.parseDouble(sc.nextLine());
				
				sc.nextLine();
				demands = new double[nbCustomers+nbParkings+nbCentralDepots][nbProducts];
				for(int i = 0; i < nbParkings; i++)
					for(int j = 0; j < nbProducts; j++)
						demands[i][j] = 0;
				for(int i = 0; i < nbCustomers; i++){
					str = sc.nextLine().split(" ");
					for(int j = 0; j < nbProducts; j++)
						demands[i+nbParkings+nbCentralDepots][j] = Double.parseDouble(str[j]);
				}
				
				sc.nextLine();
				
				for(int i = 0; i < nbCustomers; i++){
					str = sc.nextLine().split(" ");
					truckPoints.add(id);
					customerPoints.add(id);
					visitedPoints.add(id);
					earliestArrivalTime[id] = Integer.parseInt(str[0]);
					latestArrivalTime[id] = Integer.parseInt(str[1]);
					waitingDuration[id] = Integer.parseInt(str[2]);
					durationTimeUnit[id] = Double.parseDouble(str[3]);
					id++;
				}
				
				sc.nextLine();
				vhRestrictProducts = new int[nbVehicles][nbProducts];
				for(int i = 0; i < nbVehicles; i++){
					str = sc.nextLine().split(" ");
					for(int j = 0; j < nbProducts; j++)
						vhRestrictProducts[i][j] = Integer.parseInt(str[j]);
				}
				
				sc.nextLine();
				vhRestrictCustomers = new int[nbVehicles][nbCustomers+nbParkings+nbCentralDepots];
				for(int i = 0; i < nbVehicles; i++)
					for(int j = 0; j < nbParkings + nbCentralDepots; j++)
						vhRestrictCustomers[i][j] = 1;
				for(int i = 0; i < nbVehicles; i++){
					str = sc.nextLine().split(" ");
					for(int j = 0; j < nbCustomers; j++)
						vhRestrictCustomers[i][j+nbParkings+nbCentralDepots] = Integer.parseInt(str[j]);
				}
				
				sc.nextLine();
				vhRemainCustomers = new int[nbVehicles][nbCustomers+nbParkings+nbCentralDepots];
				for(int i = 0; i < nbVehicles; i++)
					for(int j = 0; j < nbParkings; j++)
						vhRemainCustomers[i][j] = 0;
				for(int i = 0; i < nbVehicles; i++){
					str = sc.nextLine().split(" ");
					for(int j = 0; j < nbCustomers; j++)
						vhRemainCustomers[i][j+nbParkings+nbCentralDepots] = Integer.parseInt(str[j]);
				}
				
				sc.nextLine();
				travelTime = new double[truckPoints.size()][truckPoints.size()];
				for(int i = 0; i < truckPoints.size(); i++)
					for(int j = 0; j < truckPoints.size(); j++)
						travelTime[i][j] = 0;
				int nbLines = Integer.parseInt(sc.nextLine());
				for(int i = 0; i < nbLines; i++){
					str = sc.nextLine().split(" ");
					int f = Integer.parseInt(str[0]);
					int t = Integer.parseInt(str[1]);
					double d = Double.parseDouble(str[2]);
					travelTime[f][t] = d;
					if(d > Max_Distance)
						Max_Distance = d;
				}
				
			}
			sc.close();
		}catch(Exception e){
			System.out.println(e);
		}
		
		createArcTrucks();
		calculateServeDurationAtCustomer();
	}
	
	public void createArcTrucks(){
		arcVehicles = new HashSet<ArrayList<Integer>>();
		inArcVehicles = new HashMap<Integer, HashSet<Integer>>();
		outArcVehicles = new HashMap<Integer, HashSet<Integer>>();
		
		for(int u : truckPoints){
			for(int v : truckPoints){
				if(u == v)
					continue;
				if(parkings.contains(u) && parkings.contains(v))
					continue;
				if(parkings.contains(u) && customerPoints.contains(v))
					continue;
				if(centralDepots.contains(u) && parkings.contains(v))
					continue;
				if(centralDepots.contains(u) && centralDepots.contains(v))
					continue;

				ArrayList<Integer> arc = new ArrayList<Integer>();
				arc.add(u);
				arc.add(v);
				arcVehicles.add(arc);
			}
		}
		
		for(int v : truckPoints){
			inArcVehicles.put(v, new HashSet<Integer>());
			outArcVehicles.put(v, new HashSet<Integer>());
		}

		for(ArrayList<Integer> arc : arcVehicles){
			HashSet<Integer> outKey = outArcVehicles.get(arc.get(0));
			outKey.add(arc.get(1));
			outArcVehicles.put(arc.get(0), outKey);
			HashSet<Integer> inVal = inArcVehicles.get(arc.get(1));
			inVal.add(arc.get(0));
			inArcVehicles.put(arc.get(1), inVal);
		}
	}
	
	public void defineFlowVariableOfVehicles(GRBModel model){
		X = new ArrayList<GRBVar>();
		arc2X = new HashMap<String, GRBVar>();
		
		for(int k = 0; k < nbVehicles; k++){
			for(int q = 0; q < vhNbTours[k]; q++){
				for(ArrayList<Integer> arc : arcVehicles){
					int u = arc.get(0);
					int v = arc.get(1);
					try {
						GRBVar var = model.addVar(0.0, 1.0, 0.0, GRB.BINARY, "X(" + k + "," + u + "," + v + "," + q + ")");
						X.add(var);
						String s = k + "-" + u + "-" + v + "-" + q;
						arc2X.put(s, var);
					} catch (GRBException e) {
						System.out.println("Error code: " + e.getErrorCode() + ". " +
					            e.getMessage());
					}
				}
			}
		}
	}
	
	public void defineQuantityOfLoadAtDepot(GRBModel model){
		L = new ArrayList<GRBVar>();
		arc2L = new HashMap<String, GRBVar>();
		
		for(int k = 0; k < nbVehicles; k++){
			for(int q = 0; q < vhNbTours[k]; q++){
				for(int p = 0; p < nbProducts; p++){
					int maxItem = (int)(vhUpperCapacity[k]/weightProducts[p]);
					try {
						GRBVar var = model.addVar(0.0, maxItem, 0.0, GRB.INTEGER, "L(" + k + "," + p + "," + q + ")");
						L.add(var);
						String s = k + "-" + p + "-" + q;
						arc2L.put(s, var);
					} catch (GRBException e) {
						System.out.println("Error code: " + e.getErrorCode() + ". " +
					            e.getMessage());
					}
				}
			}
		}
	}
	
	public void defineOperationOfTrip(GRBModel model){
		Z = new ArrayList<GRBVar>();
		arc2Z = new HashMap<String, GRBVar>();
		
		for(int k = 0; k < nbVehicles; k++){
			for(int q = 0; q < vhNbTours[k]; q++){
				try {
					GRBVar var = model.addVar(0.0, 1.0, 0.0, GRB.BINARY, "Z(" + k + "," + q + ")");
					Z.add(var);
					String s = k + "-" + q;
					arc2Z.put(s, var);
				} catch (GRBException e) {
					System.out.println("Error code: " + e.getErrorCode() + ". " +
				            e.getMessage());
				}
			}
		}
	}
	
	public void defineRequestMark(GRBModel model){
		Y = new ArrayList<GRBVar>();
		arc2Y = new HashMap<String, GRBVar>();
		
		for(int i : customerPoints){
			try {
				GRBVar var = model.addVar(0.0, 1.0, 0.0, GRB.BINARY, "Y(" + i + ")");
				Y.add(var);
				String idx = "" + i;
				arc2Y.put(idx, var);
			} catch (GRBException e) {
				System.out.println("Error code: " + e.getErrorCode() + ". " +
			            e.getMessage());
			}
		}
	}
	
	public void defineLastPointOfTripVariables(GRBModel model){
		W = new ArrayList<GRBVar>();
		point2W = new HashMap<String, GRBVar>();
		
		for(int k = 0; k < nbVehicles; k++){
			for(int q = 0; q < vhNbTours[k]; q++){
				for(int i : customerPoints){
					try {
						GRBVar var = model.addVar(0.0, 1.0, 0.0, GRB.BINARY, "W(" + k + "," + i + "," + q + ")");
						W.add(var);
						String s = k + "-" + i + "-" + q;
						point2W.put(s, var);
					} catch (GRBException e) {
						System.out.println("Error code: " + e.getErrorCode() + ". " +
					            e.getMessage());
					}
				}
			}
		}
	}
	
	public void defineServingTimeAtPointVariables(GRBModel model){
		servingTimeAtPoint = new ArrayList<GRBVar>();
		point2servingTimeAtPoint = new HashMap<String, GRBVar>();
		
		for(int k = 0; k < nbVehicles; k++){
			for(int i : truckPoints){
				for(int q = 0; q < vhNbTours[k]; q++){
					try{
						GRBVar var = model.addVar(0.0, vhEndWorkingTime[k], 0.0, GRB.CONTINUOUS, "servingTimeAtPoint(" + k + "," + i + "," + q + ")");
						servingTimeAtPoint.add(var);
						String key = k + "-" + i + "-" + q;
						point2servingTimeAtPoint.put(key, var);
					} catch (GRBException e) {
						System.out.println("Error code: " + e.getErrorCode() + ". " +
					            e.getMessage());
					}
				}
			}
		}
	}
	
	public void defineVariables(GRBModel model){
		defineFlowVariableOfVehicles(model);
		defineQuantityOfLoadAtDepot(model);
		defineOperationOfTrip(model);
		defineLastPointOfTripVariables(model);
		defineServingTimeAtPointVariables(model);
		defineRequestMark(model);
	}
	
	public void flowBalanceConstraint(GRBModel model){
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int u : truckPoints){
					GRBLinExpr expr = new GRBLinExpr();
					for(int q = 0; q < vhNbTours[k]; q++){
						for(int v : inArcVehicles.get(u)){
							String s = k + "-" + v + "-" + u + "-" + q;
							GRBVar x = arc2X.get(s);
							expr.addTerm(1, x);
						}
						for(int v : outArcVehicles.get(u)){
							String s = k + "-" + u + "-" + v + "-" + q;
							GRBVar x = arc2X.get(s);
							expr.addTerm(-1, x);
						}
					}
					model.addConstr(expr, GRB.EQUAL, 0.0, "BalanceFlowAll(" + k + "," + u + ")");
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void flowBalanceOnEachTripConstraint(GRBModel model){
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(int u : customerPoints){
						GRBLinExpr expr = new GRBLinExpr();
						for(int v : inArcVehicles.get(u)){
							String s = k + "-" + v + "-" + u + "-" + q;
							GRBVar x = arc2X.get(s);
							expr.addTerm(1, x);
						}
						for(int v : outArcVehicles.get(u)){
							String s = k + "-" + u + "-" + v + "-" + q;
							GRBVar x = arc2X.get(s);
							expr.addTerm(-1, x);
						}
						model.addConstr(expr, GRB.EQUAL, 0.0, "BalanceFlow(" + k + "," + u + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void SubtourEliminationConstraint(GRBModel model){
		SubSetGenerator ssgen = new SubSetGenerator(customerPoints);
		ssgen.generate();
		int t = 0;
		try{
			for(HashSet<Integer> s : ssgen.subSet){
				HashSet<ArrayList<Integer>> A = getArcInduced(s, arcVehicles);
				int m = s.size() - 1;
				if(m <= 0)
					continue;
				for(int k = 0; k < nbVehicles; k++){
					for(int q = 0; q < vhNbTours[k]; q++){
						GRBLinExpr expr = new GRBLinExpr();	
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							String str = k + "-" + au + "-" + av + "-" + q;
							if(arc2X.get(str) == null)
								continue;
							
							GRBVar x = arc2X.get(str);
							if(checkExist(A, arc))
								expr.addTerm(1, x);
						}
						model.addConstr(expr, GRB.LESS_EQUAL, m, "SubTourInTrip(" + k + "," + t + ")");
						t++;
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	
	public void defineEachCustomerVisitedAtMostOnceConstraint(GRBModel model){
		try{
			for(int i : customerPoints){
				GRBLinExpr expr = new GRBLinExpr();
				for(int k = 0; k < nbVehicles; k++){
					for(int q = 0; q < vhNbTours[k]; q++){
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							String s = k + "-" + au + "-" + av + "-" + q;
							GRBVar x = arc2X.get(s);
							if(av == i){
								expr.addTerm(1, x);
							}
						}
					}
				}
				model.addConstr(expr, GRB.LESS_EQUAL, 1.0, "CustomerVisitedOnce(" + i + ")");
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineOneDepotVisitedOneTimeForEachTrip(GRBModel model){
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					GRBLinExpr expr1 = new GRBLinExpr();
					
					for(int dp : centralDepots){
						for(int j : customerPoints){
							String kjdpq1 = k + "-" + dp + "-" + j + "-" + q;
							GRBVar x1 = arc2X.get(kjdpq1);
							expr1.addTerm(1, x1);
						}
					}
					
					String kq = k + "-" + q;
					GRBVar z = arc2Z.get(kq);
					expr1.addTerm(-1, z);
					model.addConstr(expr1, GRB.EQUAL, 0.0, "oneDepotVisitedOnetimeForEachTrip(" + k + "," + q + ")");
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
//	public void defineEachVehicleStartsAndComesBackParkingAtMostOnce(GRBModel model){
//		try{
//			for(int k = 0; k < nbVehicles; k++){
//				GRBLinExpr expr1 = new GRBLinExpr();
//				GRBLinExpr expr2 = new GRBLinExpr();
//				int pk = vh2parking.get(k);
//				for(int j : centralDepots){
//					String kpkjq = k + "-" + pk + "-" + j + "-0";
//					GRBVar x1 = arc2X.get(kpkjq);
//					expr1.addTerm(1, x1);
//				}
//				String k0 = k + "-0";
//				GRBVar z = arc2Z.get(k0);
//				model.addConstr(expr1, GRB.EQUAL, z, "vhStartParkingAtMostone1(" + k + "," + pk + ")");
//				//model.addConstr(expr2, GRB.EQUAL, z, "vhNotStartAtOtherParking2(" + k + "," + pk + ")");
//			}
//			for(int k = 0; k < nbVehicles; k++){
//				GRBLinExpr expr2 = new GRBLinExpr();
//				int pk = vh2parking.get(k);
//				for(int q = 0; q < vhNbTours[k]; q++) {
//					for(int j : customerPoints){
//						String kjpkq = k + "-" + j + "-" + pk + "-" + q;
//						GRBVar x1 = arc2X.get(kjpkq);
//						expr2.addTerm(1, x1);
//					}
//				}
//				String k0 = k + "-0";
//				GRBVar z = arc2Z.get(k0);
//				model.addConstr(expr2, GRB.EQUAL, z, "vhStartParkingAtMostone2(" + k + "," + pk + ")");
//			}
//		} catch (GRBException e) {
//			System.out.println("Error code: " + e.getErrorCode() + ". " +
//		            e.getMessage());
//		}
//	}
	
//	public void defineEachVehicleArriveDepotAtMostOnceInEachTrip(GRBModel model){
//		try{
//			for(int k = 0; k < nbVehicles; k++){
//				for(int q = 0; q < vhNbTours[k]; q++){
//					GRBLinExpr expr1 = new GRBLinExpr();
//					GRBLinExpr expr2 = new GRBLinExpr();
//					for(ArrayList<Integer> arc : arcVehicles){
//						int u = arc.get(0);
//						int v = arc.get(1);
//						if(centralDepots.contains(u)) {
//							String kuvq = k + "-" + u + "-" + v + "-" + q;
//							GRBVar x = arc2X.get(kuvq);
//							expr1.addTerm(1, x);
//						}
//						//thoi gian den diem ngay sau central depot
//						else if(centralDepots.contains(v)){
//							String kuvq = k + "-" + u + "-" + v + "-" + q;
//							GRBVar x = arc2X.get(kuvq);
//							expr2.addTerm(1, x);
//						}
//					}
//					model.addConstr(expr1, GRB.LESS_EQUAL, 1, "visitOneDepotInATrip1(" + k + "," + q +")");
//					model.addConstr(expr2, GRB.LESS_EQUAL, 1, "visitOneDepotInATrip2(" + k + "," + q +")");
//				}
//			}
//		} catch (GRBException e) {
//			System.out.println("Error code: " + e.getErrorCode() + ". " +
//		            e.getMessage());
//		}
//	}
	
//	public void defineServingTimeConstraintCommon(GRBModel model){
//		try{
//			for(ArrayList<Integer> arc : arcVehicles){
//				for(int k = 0; k < nbVehicles; k++){
//					for(int q = 0; q < vhNbTours[k]; q++){
//						int u = arc.get(0);
//						int v = arc.get(1);
//						String kuq = k + "-" + u + "-" + q;
//						GRBVar stkuq = point2servingTimeAtPoint.get(kuq);
//						
//						String kvq = k + "-" + v + "-" + q;
//						GRBVar stkvq = point2servingTimeAtPoint.get(kvq);
//						
//						String kuvq = k + "-" + u + "-" + v + "-" + q;
//						GRBVar x = arc2X.get(kuvq);
//						
//						GRBLinExpr expr1 = new GRBLinExpr();
//						expr1.addTerm(1, stkuq);
//						expr1.addTerm(-1, stkvq);
//						expr1.addTerm(M1, x);
//						double tij = travelTime[u][v];
//						model.addConstr(expr1, GRB.LESS_EQUAL, M1 - tij - serviceDuration[u], "stTimeAtPointConstr1(" + k + "," + v + "," + q + ")");
//					}
//				}
//			}
//		} catch (GRBException e) {
//			System.out.println("Error code: " + e.getErrorCode() + ". " +
//		            e.getMessage());
//		}
//	}

	public void defineServingTimeConstraint(GRBModel model){
		try{
		
			//thoi gian xuat phat tai depot = thoi gian den + thoi gian load hang
			//thoi gian xuat phat tai diem v bang thoi gian tai u cong thoi gian di chuyen + servingTime
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(ArrayList<Integer> arc : arcVehicles){
						int u = arc.get(0);
						int v = arc.get(1);
						if(centralDepots.contains(v))
							continue;
						//thoi gian den diem ngay sau central depot
						if(centralDepots.contains(u)){
							String kuq = k + "-" + u + "-" + q;
							GRBVar stkuq = point2servingTimeAtPoint.get(kuq);
							
							String kvq = k + "-" + v + "-" + q;
							GRBVar stkvq = point2servingTimeAtPoint.get(kvq);
							
							String kuvq = k + "-" + u + "-" + v + "-" + q;
							GRBVar x = arc2X.get(kuvq);
							
							GRBLinExpr expr1 = new GRBLinExpr();
							expr1.addTerm(1, stkuq);
							expr1.addTerm(-1, stkvq);
							expr1.addTerm(M, x);

							for(int p = 0; p < nbProducts; p++){
								String kpq = k + "-" + p + "-" + q;
								GRBVar l = arc2L.get(kpq);
								expr1.addTerm(weightProducts[p]*durationTimeUnit[u], l);
							}
							
							double tij = travelTime[u][v];
							model.addConstr(expr1, GRB.LESS_EQUAL, M - tij - serviceDuration[u], "stTimeAtPointConstr1(" + k + "," + v + "," + q + ")");
							
//							GRBLinExpr expr2 = new GRBLinExpr();
//							expr2.addTerm(1, stkuq);
//							expr2.addTerm(-1, stkvq);
//							expr2.addTerm(-M, x);
//							
//							for(int p = 0; p < nbProducts; p++){
//								String kpq = k + "-" + p + "-" + q;
//								GRBVar l = arc2L.get(kpq);
//								expr2.addTerm(weightProducts[p]*durationTimeUnit[u], l);
//							}
//							model.addConstr(expr2, GRB.GREATER_EQUAL, -M - tij - serviceDuration[u], "stTimeAtPointConstr2(" + k + "," + v + "," + q + ")");

							continue;
						}
						String kuq = k + "-" + u + "-" + q;
						GRBVar stkuq = point2servingTimeAtPoint.get(kuq);
						
						String kvq = k + "-" + v + "-" + q;
						GRBVar stkvq = point2servingTimeAtPoint.get(kvq);
						
						String kuvq = k + "-" + u + "-" + v + "-" + q;
						GRBVar x = arc2X.get(kuvq);
						
						GRBLinExpr expr1 = new GRBLinExpr();
						expr1.addTerm(1, stkuq);
						expr1.addTerm(-1, stkvq);
						expr1.addTerm(M, x);
						
						double tij = travelTime[u][v];
						model.addConstr(expr1, GRB.LESS_EQUAL, M - tij - serviceDuration[u], "stTimeAtPointConstr1(" + k + "," + v + "," + q + ")");
						
//						GRBLinExpr expr2 = new GRBLinExpr();
//						expr2.addTerm(1, stkuq);
//						expr2.addTerm(-1, stkvq);
//						expr2.addTerm(-M, x);
//						model.addConstr(expr2, GRB.GREATER_EQUAL, -M - tij - serviceDuration[u], "stTimeAtPointConstr2(" + k + "," + v + "," + q + ")");
					}
				}
			}
			
			//thoi gian den central depot
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					if(q == 0){
						int pk = vh2parking.get(k);
						//chuyen 0: thoi gian den central depot = thoi gian den parking + thoi gian di chuyen
						for(int dp : centralDepots){
							GRBLinExpr expr1 = new GRBLinExpr();
							GRBLinExpr expr2 = new GRBLinExpr();
							String kdpq = k + "-" + dp + "-" + q;
							GRBVar stkdpq = point2servingTimeAtPoint.get(kdpq);

							for(int i : customerPoints) {
								String kpkdpq = k + "-" + dp + "-" + i + "-0";
								GRBVar x = arc2X.get(kpkdpq);
//								expr1.addTerm(M, x);
								expr2.addTerm(-M, x);
							}
							
							double tij = travelTime[pk][dp];
//							expr1.addTerm(1, stkdpq);
//							model.addConstr(expr1, GRB.LESS_EQUAL, M + tij + serviceDuration[pk] + earliestArrivalTime[pk], "stTimeAtDepotConstr1(" + k + "," + dp + "," + q + ")");
							
							expr2.addTerm(1, stkdpq);
							model.addConstr(expr2, GRB.GREATER_EQUAL, -M + tij + serviceDuration[pk] + earliestArrivalTime[pk], "stTimeAtDepotConstr2(" + k + "," + dp + "," + q + ")");	
						}
					}
					else{
						for(int u : customerPoints){
							for(int dp : centralDepots){
								String kuq1 = k + "-" + u + "-" + (q-1);
								GRBVar stkuq1 = point2servingTimeAtPoint.get(kuq1);
								
								String kdpq = k + "-" + dp + "-" + q;
								GRBVar stkdpq = point2servingTimeAtPoint.get(kdpq);
								
								String kudpq1 = k + "-" + u + "-" + dp + "-" + (q-1);
								GRBVar x = arc2X.get(kudpq1);
								
								String kq = k + "-" + q;
								GRBVar z = arc2Z.get(kq);
	
//								GRBVar w = point2W.get(kuq1);
								
								GRBLinExpr expr1 = new GRBLinExpr();
								expr1.addTerm(1, stkuq1);
								expr1.addTerm(M, z);
//								expr1.addTerm(M, w);
								expr1.addTerm(M, x);
								expr1.addTerm(-1, stkdpq);
								
								double tij = travelTime[u][dp];
								model.addConstr(expr1, GRB.LESS_EQUAL, 2*M - tij - serviceDuration[u], "stTimeAtDepotConstr1(" + k + "," + u + "," + dp + "," + q + ")");
								
//								GRBLinExpr expr2 = new GRBLinExpr();
//								expr2.addTerm(1, stkuq1);
//								expr2.addTerm(-M, z);
////								expr2.addTerm(-M, w);
//								expr1.addTerm(-M, x);
//								expr2.addTerm(-1, stkdpq);
//		
//								model.addConstr(expr2, GRB.GREATER_EQUAL, -2*M - tij - serviceDuration[u], "stTimeAtDepotConstr2(" + k + "," + u + "," + dp + "," + q + ")");	
							}
						}
					}
				}
			}
			
//			//thoi gian ve parking
//			for(int k = 0; k < nbVehicles; k++){
//				for(int q = 1; q < vhNbTours[k]; q++){
//					for(int u : truckPoints){
//						if(centralDepots.contains(u))
//							continue;
//						String kuq1 = k + "-" + u + "-" + (q-1);
//						GRBVar stkuq1 = point2servingTimeAtPoint.get(kuq1);
//						
//						for(int dp : centralDepots){
//							String k0q = k + "-" + dp + "-" + q;
//							GRBVar stk0q = point2servingTimeAtPoint.get(k0q);
//							
//							String ku0q1 = k + "-" + u + "-" + dp + "-" + (q-1);
//							GRBVar x = arc2X.get(ku0q1);
//
//							GRBLinExpr expr1 = new GRBLinExpr();
//							expr1.addTerm(1, stkuq1);
//							expr1.addTerm(M, x);
//							expr1.addTerm(-1, stk0q);
//							
//							int tij = travelTime[u][dp];
//							model.addConstr(expr1, GRB.LESS_EQUAL, M - tij - serviceDuration[u], "stTimeAtDepotConstr1(" + k + "," + u + "," + q + ")");
//							
//							GRBLinExpr expr2 = new GRBLinExpr();
//							expr2.addTerm(1, stkuq1);
//							expr2.addTerm(-M, x);
//							expr2.addTerm(-1, stk0q);
//	
//							model.addConstr(expr2, GRB.GREATER_EQUAL, -M - tij - serviceDuration[u], "stTimeAtDepotConstr2(" + k + "," + u + "," + q + ")");	
//						}
//					}
//				}
//			}
			
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineServingTimeAtPointsWithTimeWindow(GRBModel model){
		try{	
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(int u : visitedPoints){
						String kuq = k + "-" + u + "-" + q;
						GRBVar stkuq = point2servingTimeAtPoint.get(kuq);
						
						GRBLinExpr expr1 = new GRBLinExpr();
						expr1.addTerm(1, stkuq);
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							if(au == u){
								String kuvq = k + "-" + au + "-" + av + "-" + q;
								GRBVar x = arc2X.get(kuvq);
								expr1.addTerm(M, x);
							}
						}
						
						model.addConstr(expr1, GRB.LESS_EQUAL, M + latestArrivalTime[u], "ServingTimeLELatest(" + k + "," + u + "," + q + ")");
						
						GRBLinExpr expr2 = new GRBLinExpr();
						expr2.addTerm(1, stkuq);
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							if(au == u){
								String kuvq = k + "-" + au + "-" + av + "-" + q;
								GRBVar x = arc2X.get(kuvq);
								expr2.addTerm(-M, x);
							}
						}
						
						model.addConstr(expr2, GRB.GREATER_EQUAL, -M + earliestArrivalTime[u], "ServingTimeLEEarliest(" + k + "," + u + "," + q + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineLoadGoodAtDepotConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int p = 0; p < nbProducts; p++){
					for(int q = 0; q < vhNbTours[k]; q++){
						GRBLinExpr expr1 = new GRBLinExpr();
						
						String kpq = k + "-" + p + "-" + q;
						GRBVar l = arc2L.get(kpq);
						
						expr1.addTerm(1, l);
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							String kuvq = k + "-" + au + "-" + av + "-" + q;
							GRBVar x = arc2X.get(kuvq);
							expr1.addTerm(-demands[au][p], x);
						}
						model.addConstr(expr1, GRB.EQUAL, 0.0, "LoadGoodAtDepot1(" + k + "," + p + "," + q + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineCapacityAtDepotConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					GRBLinExpr expr1 = new GRBLinExpr();
					GRBLinExpr expr2 = new GRBLinExpr();
					for(int p = 0; p < nbProducts; p++){
						String kpq = k + "-" + p + "-" + q;
						GRBVar l = arc2L.get(kpq);
						expr1.addTerm(weightProducts[p], l);
						expr2.addTerm(weightProducts[p], l);
					}
					String kq = k + "-" + q;
					GRBVar z = arc2Z.get(kq);
					expr1.addTerm(M, z);
					expr2.addTerm(-M, z);
					model.addConstr(expr1, GRB.LESS_EQUAL, M + vhUpperCapacity[k], "upperCapacityAtDepot1(" + k + "," + q + ")");
					model.addConstr(expr2, GRB.GREATER_EQUAL, -M + vhLowerCapacity[k], "lowerCapacityAtDepot2(" + k + "," + q + ")");	
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineRelatedXZConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					GRBLinExpr expr = new GRBLinExpr();
					
					String kq = k + "-" + q;
					GRBVar z = arc2Z.get(kq);
					expr.addTerm(1, z);
					
					for(ArrayList<Integer> arc : arcVehicles){
						int au = arc.get(0);
						int av = arc.get(1);
						String kuvq = k + "-" + au + "-" + av + "-" + q;
						GRBVar x = arc2X.get(kuvq);
						expr.addTerm(-1, x);
					}
					
					model.addConstr(expr, GRB.LESS_EQUAL, 0.0, "RelatedXZConstr1(" + k + "," + q + ")");
				}
			}
			
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(ArrayList<Integer> arc : arcVehicles){
						GRBLinExpr expr = new GRBLinExpr();
						
						String kq = k + "-" + q;
						GRBVar z = arc2Z.get(kq);
						expr.addTerm(-1, z);
						int au = arc.get(0);
						int av = arc.get(1);
						String kuvq = k + "-" + au + "-" + av + "-" + q;
						GRBVar x = arc2X.get(kuvq);
						expr.addTerm(1, x);
						
						model.addConstr(expr, GRB.LESS_EQUAL, 0.0, "RelatedXZConstr2(" + k + "," + au + "," + av + "," + q + ")");
					}
				}
			}
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineXYConstraint(GRBModel model){
		try{
			for(int i : customerPoints){
				GRBLinExpr expr = new GRBLinExpr();
				for(int k = 0; k < nbVehicles; k++){
					for(int q = 0; q < vhNbTours[k]; q++){
						for(ArrayList<Integer> arc : arcVehicles){
							int au = arc.get(0);
							int av = arc.get(1);
							String s = k + "-" + au + "-" + av + "-" + q;
							GRBVar x = arc2X.get(s);
							if(av == i){
								expr.addTerm(1, x);
							}
						}
					}
				}
				String idx = "" + i;
				expr.addTerm(-1, arc2Y.get(idx));
				model.addConstr(expr, GRB.EQUAL, 0.0, "RequestMark(" + i + ")");
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineTripContinuosConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]-1; q++){
					GRBLinExpr expr = new GRBLinExpr();
					String kq = k + "-" + q;
					GRBVar zq = arc2Z.get(kq);
					expr.addTerm(-1, zq);
					
					int nq = q + 1;
					String knq = k + "-" + nq;
					GRBVar znq = arc2Z.get(knq);
					expr.addTerm(1, znq);
					model.addConstr(expr, GRB.LESS_EQUAL, 0.0, "ContinueTrip(" + k + "," + q + ")");
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineNextTripConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 1; q < vhNbTours[k]; q++){
					for(int u : centralDepots){
						GRBLinExpr expr = new GRBLinExpr();
						for(int v : inArcVehicles.get(u)){
							if(parkings.contains(v))
								continue;
							String s = k + "-" + v + "-" + u + "-" + (q-1);
							GRBVar x = arc2X.get(s);
							expr.addTerm(1, x);
						}
						for(int v : outArcVehicles.get(u)){
							String s = k + "-" + u + "-" + v + "-" + q;
							GRBVar x = arc2X.get(s);
							expr.addTerm(-1, x);
						}
						model.addConstr(expr, GRB.EQUAL, 0.0, "BalanceFlow(" + k + "," + u + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineEachVehicleStartsAndComesBackParkingAtMostOnce(GRBModel model){
		try{
			for(int k = 0; k < nbVehicles; k++){
				GRBLinExpr expr1 = new GRBLinExpr();
				GRBLinExpr expr2 = new GRBLinExpr();
				int pk = vh2parking.get(k);
				for(int j : centralDepots){
					String kpkjq = k + "-" + pk + "-" + j + "-0";
					GRBVar x1 = arc2X.get(kpkjq);
					expr1.addTerm(1, x1);
				}
				String k0 = k + "-0";
				GRBVar z = arc2Z.get(k0);
				model.addConstr(expr1, GRB.EQUAL, z, "vhStartParkingAtMostone1(" + k + "," + pk + ")");
				//model.addConstr(expr2, GRB.EQUAL, z, "vhNotStartAtOtherParking2(" + k + "," + pk + ")");
			}
			for(int k = 0; k < nbVehicles; k++){
				GRBLinExpr expr2 = new GRBLinExpr();
				int pk = vh2parking.get(k);
				for(int q = 0; q < vhNbTours[k]; q++) {
					for(int j : customerPoints){
						String kjpkq = k + "-" + j + "-" + pk + "-" + q;
						GRBVar x1 = arc2X.get(kjpkq);
						expr2.addTerm(1, x1);
					}
				}
				String k0 = k + "-0";
				GRBVar z = arc2Z.get(k0);
				model.addConstr(expr2, GRB.EQUAL, z, "vhStartParkingAtMostone2(" + k + "," + pk + ")");
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineLastPointOfTripConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(int i : customerPoints){
						GRBLinExpr expr = new GRBLinExpr();
						String kiq = k + "-" + i + "-" + q;
						GRBVar w = point2W.get(kiq);
						expr.addTerm(1, w);
						
						for(int v : outArcVehicles.get(i)){
							if(customerPoints.contains(v)){
								String s = k + "-" + i + "-" + v + "-" + q;
								if(arc2X.get(s) != null){
									GRBVar x = arc2X.get(s);
									expr.addTerm(1, x);
								}
							}
						}
						
						for(int v : inArcVehicles.get(i)){
							String s = k + "-" + v + "-" + i + "-" + q;
							if(arc2X.get(s) != null){
								GRBVar x = arc2X.get(s);
								expr.addTerm(-1, x);
							}
						}

						model.addConstr(expr, GRB.EQUAL, 0.0, "LastPointTrip(" + k + "," + i + "," + q + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineRestrictVehicleCustomerConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int i : truckPoints){
					if(vhRestrictCustomers[k][i] == 0){
						GRBLinExpr expr = new GRBLinExpr();
						for(int q = 0; q < vhNbTours[k]; q++){
							for(ArrayList<Integer> arc : arcVehicles){
								int u = arc.get(0);
								int v = arc.get(1);
								if(v == i){
									String kuvq = k + "-" + u + "-" + v + "-" + q;
									GRBVar x = arc2X.get(kuvq);
									expr.addTerm(1, x);
								}
							}
						}
						model.addConstr(expr, GRB.EQUAL, 0.0, "RestrictVehicleCustomer" + k + "," + i + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineRestrictVehicleProductConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int p = 0; p < nbProducts; p++){
					if(vhRestrictProducts[k][p] == 0){
						GRBLinExpr expr = new GRBLinExpr();
						for(int q = 0; q < vhNbTours[k]; q++){
							String kpq = k + "-" + p + "-" + q;
							GRBVar l = arc2L.get(kpq);
							expr.addTerm(1, l);
						}
//						for(int q = 0; q < vhNbTours[k]; q++){
//							for(ArrayList<Integer> arc : arcVehicles){
//								int u = arc.get(0);
//								int v = arc.get(1);
//								if(demands[u][p] > 0){
//									String kuvq = k + "-" + u + "-" + v + "-" + q;
//									GRBVar x = arc2X.get(kuvq);
//									expr.addTerm(1, x);
//								}
//							}
//						}
						model.addConstr(expr, GRB.EQUAL, 0.0, "RestrictProductCustomer" + k + "," + p + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public void defineRemainCustomerConstraint(GRBModel model){		
		try{
			for(int k = 0; k < nbVehicles; k++){
				for(int i : customerPoints){
					if(vhRemainCustomers[k][i] == 1){
						GRBLinExpr expr = new GRBLinExpr();
						for(int q = 0; q < vhNbTours[k]; q++){
							for(ArrayList<Integer> arc : arcVehicles){
								int u = arc.get(0);
								int v = arc.get(1);
								if(v == i){
									String kuvq = k + "-" + u + "-" + v + "-" + q;
									GRBVar x = arc2X.get(kuvq);
									expr.addTerm(1, x);
								}
							}
						}
						model.addConstr(expr, GRB.EQUAL, 1.0, "vhRemainCustomer" + k + "," + i + ")");
					}
				}
			}
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}	
	
	public void defineConstraints(GRBModel model){
		flowBalanceConstraint(model);//2
		
		flowBalanceOnEachTripConstraint(model);//3

		//SubtourEliminationConstraint(model);
		
		//rang buoc xe di den dp trong chuyen q thi xe di ra khoi dp trong chuyen q+1
		defineNextTripConstraint(model);//4
				
		//cong thuc tinh st tai moi diem
		defineServingTimeConstraint(model);//5, 6,7,8

		//rang buoc time window cua st tai moi diem
		defineServingTimeAtPointsWithTimeWindow(model);//9,10
//		
		//rang buoc tong so hang load tai depot = tong so hang dem giao
		defineLoadGoodAtDepotConstraint(model);//11
//		
//		//rang buoc can duoi va can tren tai trong cua xe k trong chuyen q
		defineCapacityAtDepotConstraint(model);//12, 13
//		
		//rang buoc moi KH i chi duoc tham 1 lan trong moi xe k moi chuyen q.
		defineEachCustomerVisitedAtMostOnceConstraint(model);//14
		
		defineOneDepotVisitedOneTimeForEachTrip(model);//15
		
		defineEachVehicleStartsAndComesBackParkingAtMostOnce(model);//16,17
	
		//rang buoc X, Z
		defineRelatedXZConstraint(model);//18,19
		
		//rang buoc XY
		defineXYConstraint(model);
	
		//rang buoc xe k di chuyen q+1 thi phai thuc hien chuyen q
		defineTripContinuosConstraint(model);//20
		
		
		//rang buoc mot so xe ko duoc di den khach i
		defineRestrictVehicleCustomerConstraint(model);//21
		
		//rang buoc mot so xe ko duoc cho san pham p
		defineRestrictVehicleProductConstraint(model);//22
		
		//rang buoc xe k phai phuc vu not mot so KH i
		defineRemainCustomerConstraint(model);//23
	}
	
	public void defineObjective(GRBModel model){
		double big = 3*nbCustomers*Max_Distance;
		try{
			GRBLinExpr expr = new GRBLinExpr();
			
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					for(ArrayList<Integer> arc : arcVehicles){
						int au = arc.get(0);
						int av = arc.get(1);
						String s = k + "-" + au + "-" + av + "-" + q; 
						GRBVar x = arc2X.get(s);
						double d  = travelTime[au][av];
						d = d;
						expr.addTerm(d, x);
					}
				}
				String k0 = k + "-0";
				GRBVar z = arc2Z.get(k0);
				expr.addTerm(vhAddingCostRate[k]*0.1*big, z);
			}
			for(int i : customerPoints) {
				String idx = i + "";
				GRBVar y = arc2Y.get(idx);
				expr.addTerm(-big, y);
			}
			model.setObjective(expr, GRB.MINIMIZE);
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
	}
	
	public HashSet<ArrayList<Integer>> getArcInduced(HashSet<Integer> S, HashSet<ArrayList<Integer>> arcVehicles){
		HashSet<ArrayList<Integer>> A = new HashSet<ArrayList<Integer>>();
		for(ArrayList<Integer> arc : arcVehicles){
			int au = arc.get(0);
			int av = arc.get(1);
			if(S.contains(au) && S.contains(av)){
				ArrayList<Integer> ar = new ArrayList<Integer>();
				ar.add(au);
				ar.add(av);
				A.add(ar);
			}
		}
		return A;
	}
	
	public boolean checkExist(HashSet<ArrayList<Integer>> A, ArrayList<Integer> arc){
		for(ArrayList<Integer> e : A){
			if(e.get(0) == arc.get(0) && e.get(1) == arc.get(1))
				return true;
		}
		return false;
	}
	
	public void calculateServeDurationAtCustomer(){
		serviceDuration = new double[nbCustomers+nbCentralDepots+nbParkings];
		for(int i = 0; i < nbCustomers + nbCentralDepots+nbParkings; i++)
			serviceDuration[i] = 0;
		for(int i = 0; i < nbCustomers + nbCentralDepots+nbParkings; i++){
			serviceDuration[i] += waitingDuration[i];
			for(int p = 0; p < nbProducts; p++)
				serviceDuration[i] += durationTimeUnit[i]*demands[i][p]*weightProducts[p];
		}
	}
	
	public String getNextPoint(int x, int k, int q){
		try{
			for(int i = 0; i < X.size(); i++){
				if(X.get(i).get(GRB.DoubleAttr.X) == 1){
					String[] s = X.get(i).get(GRB.StringAttr.VarName).split(",");
					int kk = Integer.parseInt(s[0].substring(2, s[0].length()));
					int st = Integer.parseInt(s[1]);
					int qq = Integer.parseInt(s[3].substring(0, s[3].length()-1));
					if(st == x && q == qq && k == kk)
						return s[2];
				}
			}
			return null;
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
			return null;
		}
	}
	
	public int getCentralPoint(int k, int q){
		try{
			for(int i = 0; i < X.size(); i++){
				if(X.get(i).get(GRB.DoubleAttr.X) == 1){
					String[] s = X.get(i).get(GRB.StringAttr.VarName).split(",");
					int kk = Integer.parseInt(s[0].substring(2, s[0].length()));
					int st = Integer.parseInt(s[1]);
					int qq = Integer.parseInt(s[3].substring(0, s[3].length()-1));
					if(centralDepots.contains(st) && q == qq && k == kk)
						return st;
				}
			}
			return -1;
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
			return -1;
		}
	}
	
	public void getResult(GRBModel model, String outputFile){
		try{
			double t = System.currentTimeMillis();
			model.optimize();
			
			System.out.println("Optimize done!");
			
			//System.out.println("Obj: " + model.get(GRB.DoubleAttr.ObjVal));
			
			model.update();
			
			for(int i = 0; i < X.size(); i++){
				if(X.get(i).get(GRB.DoubleAttr.X) == 1)
					System.out.println(X.get(i).get(GRB.StringAttr.VarName) + " "
							+ X.get(i).get(GRB.DoubleAttr.X));
			}
			
			for(int i = 0; i < Y.size(); i++){
				if(Y.get(i).get(GRB.DoubleAttr.X) == 1)
					System.out.println(Y.get(i).get(GRB.StringAttr.VarName) + " "
							+ Y.get(i).get(GRB.DoubleAttr.X));
			}
			
			for(int i = 0; i < Z.size(); i++){
				if(Z.get(i).get(GRB.DoubleAttr.X) == 1)
					System.out.println(Z.get(i).get(GRB.StringAttr.VarName) + " "
							+ Z.get(i).get(GRB.DoubleAttr.X));
			}
			
			for(int i = 0; i < L.size(); i++){
				//if(L.get(i).get(GRB.DoubleAttr.X) == 1)
					System.out.println(L.get(i).get(GRB.StringAttr.VarName) + " "
							+ L.get(i).get(GRB.DoubleAttr.X));
			}
			
//			for(int i = 0; i < W.size(); i++){
//				//if(L.get(i).get(GRB.DoubleAttr.X) == 1)
//					System.out.println(W.get(i).get(GRB.StringAttr.VarName) + " "
//							+ W.get(i).get(GRB.DoubleAttr.X));
//			}
			
			
			for(int i = 0; i < servingTimeAtPoint.size(); i++){
				System.out.println(servingTimeAtPoint.get(i).get(GRB.StringAttr.VarName) + " "
						+ (servingTimeAtPoint.get(i).get(GRB.DoubleAttr.X)));
			}
			
			PrintWriter fw = new PrintWriter(new File(outputFile));
			String sv = "";
			String d = "";
			double distance = 0;
			for(int k = 0; k < nbVehicles; k++){
				for(int q = 0; q < vhNbTours[k]; q++){
					int s = -1;
					HashSet<Integer> visitedNodes = new HashSet<Integer>();
					String str = "";
					if(q == 0) {
						s = vh2parking.get(k);
						str = "route[" + k + "]-trip[" + q + "] = " + s + " -> ";
						int pk = s;
						s = getCentralPoint(k, q);
						if(s == -1)
							break;
						distance += travelTime[pk][s];
						str += s + " -> ";
					}
					else {
						s = getCentralPoint(k, q);
						if(s == -1)
							break;
						str = "route[" + k + "]-trip[" + q + "] = " + s + " -> ";
					}
					visitedNodes.add(s);
					String name = "servingTimeAtPoint(" + k + "," + s + "," + q;
					for(int i = 0; i < servingTimeAtPoint.size(); i++){
						if(servingTimeAtPoint.get(i).get(GRB.StringAttr.VarName).equals(name)){
							sv += servingTimeAtPoint.get(i).get(GRB.StringAttr.VarName) + " "
									+ (servingTimeAtPoint.get(i).get(GRB.DoubleAttr.X)) + "\n";
						}
					}
					
					while(true){
						String nextS = getNextPoint(s, k, q);
						if(nextS == null)
							break;
						d += "p1 = " + s + ", p2 = " + nextS 
								+ ", cost = " + travelTime[s][Integer.parseInt(nextS)] + "\n";
						distance += travelTime[s][Integer.parseInt(nextS)];
						s = Integer.parseInt(nextS);
						if(Integer.parseInt(nextS) == vh2parking.get(k)
							|| visitedNodes.contains(s)){
							str += nextS;
							break;
						}
						else
							str += nextS + " -> ";
						
						visitedNodes.add(s);
						name = "servingTimeAtPoint(" + k + "," + s + "," + q + ")";
						for(int i = 0; i < servingTimeAtPoint.size(); i++){
							if(servingTimeAtPoint.get(i).get(GRB.StringAttr.VarName).equals(name)){
								sv += servingTimeAtPoint.get(i).get(GRB.StringAttr.VarName) + " "
										+ (servingTimeAtPoint.get(i).get(GRB.DoubleAttr.X) + "\n");
							}
						}
					}
					System.out.println(str);
					fw.println(str);
				}
			}
			
			double runTime = (System.currentTimeMillis() - t)/1000;
			System.out.println("Obj: " + model.get(GRB.DoubleAttr.ObjVal)
					+ ", run time = " + runTime
					+ ", distance = " + distance);
			fw.println("Obj: " + model.get(GRB.DoubleAttr.ObjVal)
					+ ", run time = " + runTime
					+ ", distance = " + distance);
			System.out.println(d);
			fw.println(d);
			System.out.println(sv);
			fw.println(sv);
			fw.close();
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
		catch(Exception e){
			System.out.println(e);
		}
	}
	
	public void createJsonFileForHeuristic(String dir, String fileName) {
		Customer[] customers;
		Vehicle[] vehicles;
		Parking[] parkingArr;
		DistributionCenter[] distributionCenters;
		Product[] products;
		Order[] orders;
		Distance[] distances;
		
		customers = new Customer[nbCustomers];
		int idx = 0;
		for(int id : customerPoints) {
			int hour = earliestArrivalTime[id] / 3600;
			int min = (earliestArrivalTime[id] - (hour * 3600))/60;
			int sec = earliestArrivalTime[id] - (hour * 3600 + min * 60);
			String startTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			hour = latestArrivalTime[id] / 3600;
			min = (latestArrivalTime[id] - (hour * 3600))/60;
			sec = latestArrivalTime[id] - (hour * 3600 + min * 60);
			String endTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			customers[idx] = new Customer(id+"", endTime, id+"", startTime,
					durationTimeUnit[id], waitingDuration[id], 5000);
			idx++;
		}
		
		vehicles = new Vehicle[nbVehicles];
		for(int i = 0; i < nbVehicles; i++) {
			double w = vhUpperCapacity[i]*100/110;
			double lwRate = vhLowerCapacity[i] / w;
			vehicles[i] = new Vehicle(i+"", vh2parking.get(i)+"", lwRate, 1.1,
					1, w, vhNbTours[i], new String[0]);
		}
		
		parkingArr = new Parking[nbParkings];
		for(int i = 0; i < nbParkings; i++) {
			int hour = earliestArrivalTime[parkings.get(i)] / 3600;
			int min = (earliestArrivalTime[parkings.get(i)] - (hour * 3600))/60;
			int sec = earliestArrivalTime[parkings.get(i)] - (hour * 3600 + min * 60);
			String startTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			hour = latestArrivalTime[parkings.get(i)] / 3600;
			min = (latestArrivalTime[parkings.get(i)] - (hour * 3600))/60;
			sec = latestArrivalTime[parkings.get(i)] - (hour * 3600 + min * 60);
			String endTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			parkingArr[i] = new Parking(endTime, parkings.get(i)+"", startTime);
		}
		
		distributionCenters = new DistributionCenter[nbCentralDepots];
		idx = 0;
		for(int dp : centralDepots) {
			int hour = earliestArrivalTime[dp] / 3600;
			int min = (earliestArrivalTime[dp] - (hour * 3600))/60;
			int sec = earliestArrivalTime[dp] - (hour * 3600 + min * 60);
			String startTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			hour = latestArrivalTime[dp] / 3600;
			min = (latestArrivalTime[dp] - (hour * 3600))/60;
			sec = latestArrivalTime[dp] - (hour * 3600 + min * 60);
			String endTime = "2020-01-20 " + hour + ":" + min + ":" + sec;
			distributionCenters[idx] = new DistributionCenter(endTime, durationTimeUnit[dp], 
					dp+"", startTime, waitingDuration[dp]);
			idx++;
		}
		
		products = new Product[nbProducts];
		for(int i = 0; i < nbProducts; i++) {
			products[i] = new Product(weightProducts[i], i+"", "1");
		}
		
		int nbOrders = 0;
		for(int i : customerPoints){
			for(int j = 0; j < nbProducts; j++)
				if(demands[i][j] != 0)
					nbOrders++;
		}
		orders = new Order[nbOrders];
		idx = 0;
		for(int i : customerPoints){
			for(int j = 0; j < nbProducts; j++)
				if(demands[i][j] != 0) {
					orders[idx] = new Order(idx+"", j+"", (int)demands[i][j], i+"");
					idx++;
				}
		}
		
		distances = new Distance[truckPoints.size()*truckPoints.size()];
		idx = 0;
		for(int i : truckPoints) {
			for(int j : truckPoints) {
				distances[idx] = new Distance(travelTime[i][j], i+"", j+"", travelTime[i][j]);
				idx++;
			}
		}
		
		Gson g = new Gson();
		MDMTPInput jsonData = new MDMTPInput(customers, vehicles, parkingArr, distributionCenters, products, orders, distances);
		try{
			String out = g.toJson(jsonData);
			String outputFile = dir + fileName + "-heuristic.json";
			BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
		    writer.write(out);
		    writer.close();
		}catch(Exception e){
			System.out.println(e);
		}
	}
	
	public static void main(String[] args){
		String dir = "data\\vinamilk\\experiment-dataset\\";
		String dataFile = dir + "RG-6customers-2depots-2parkings-notimewindow.txt";
		String outputFile = dataFile + "-result.txt";
		MIPmodelSameTruckTrailer m = new MIPmodelSameTruckTrailer();

		
		try{
			GRBEnv env   = new GRBEnv();
			env.set("logFile", "vinamilk.log");
			env.start();
			GRBModel model = new GRBModel(env);
			
			m.readData(dataFile);
			
			m.M = 40000;
			
			m.defineVariables(model);
			
			m.defineConstraints(model);
			
			m.defineObjective(model);
			
			System.out.println("Define done!");
			
			m.getResult(model, outputFile);
			
			model.dispose();
			env.dispose();
			
		} catch (GRBException e) {
			System.out.println("Error code: " + e.getErrorCode() + ". " +
		            e.getMessage());
		}
		
	}
	
//	public static void main(String[] args) {
//		MIPmodelSameTruckTrailer m = new MIPmodelSameTruckTrailer();
//		String dir = "data\\vinamilk\\experiment-dataset\\";
//		String dataFile = dir + "vinamilk-6customers-2depots-2parkings.txt";
//		m.readData(dataFile);
//		m.createJsonFileForHeuristic(dir, "VNM-HCM-orders-2019-09-21-2parkings-2depots-2vehicles-25customers-MILP.txt");
//		
//	}
}
