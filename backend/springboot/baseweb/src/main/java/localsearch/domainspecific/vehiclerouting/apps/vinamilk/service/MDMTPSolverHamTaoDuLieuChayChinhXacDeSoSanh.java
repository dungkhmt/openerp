//package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;
//
//import java.io.BufferedReader;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileOutputStream;
//import java.io.InputStreamReader;
//import java.io.PrintWriter;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Random;
//
//import com.google.gson.Gson;
//
//import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.SearchOptimumSolution;
//import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.constraints.ContainerCapacityConstraint;
//import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.TruckContainerSolution;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Customer;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Distance;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.DistributionCenter;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.MDMTPInput;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Order;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Parking;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Product;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Utils;
//import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Vehicle;
//import localsearch.domainspecific.vehiclerouting.vrp.Constants;
//import localsearch.domainspecific.vehiclerouting.vrp.ConstraintSystemVR;
//import localsearch.domainspecific.vehiclerouting.vrp.IFunctionVR;
//import localsearch.domainspecific.vehiclerouting.vrp.VRManager;
//import localsearch.domainspecific.vehiclerouting.vrp.VarRoutesVR;
//import localsearch.domainspecific.vehiclerouting.vrp.constraints.timewindows.CEarliestArrivalTimeVR;
//import localsearch.domainspecific.vehiclerouting.vrp.entities.ArcWeightsManager;
//import localsearch.domainspecific.vehiclerouting.vrp.entities.LexMultiValues;
//import localsearch.domainspecific.vehiclerouting.vrp.entities.Point;
//import localsearch.domainspecific.vehiclerouting.vrp.functions.TotalCostVR;
//import localsearch.domainspecific.vehiclerouting.vrp.invariants.EarliestArrivalTimeVR;
//import localsearch.domainspecific.vehiclerouting.vrp.utils.DateTimeUtils;
//
//public class MDMTPSolverHamTaoDuLieuChayChinhXacDeSoSanh {
//	public MDMTPInput input;
//	public ArrayList<Point> allPoints;
//	public HashMap<String, Point> locationId2Point;
//	public HashMap<Integer, String> id2locationId;
//
//	public ArrayList<Point> startPoints;
//	public ArrayList<Point> endPoints;
//	public ArrayList<Point> depotPoints;
//	public ArrayList<Point> customerPoints;
//	public ArrayList<Point> rejectedPoints;
//	
//	public HashMap<Point, Integer> point2mark;
//	public HashMap<Point, Integer> point2arrivalTime;
//	
//	public HashMap<Point, Integer> earliestAllowedArrivalTime;
//	public HashMap<Point, Integer> waittingDuration;
//	public HashMap<Point, Double> serviceDuration;
//	public HashMap<Point, Integer> lastestAllowedArrivalTime;
//	
//	public HashMap<String, String> parking2startTime;
//	public HashMap<String, String> parking2endTime;
//	
//	public double[][] matrixT;
//	public HashMap<String, Double> pair2travelTime;
//	
//	public HashMap<String, String> productCode2type;
//	public HashMap<String, Double> productCode2grssWeight;
//	public ArrayList<String> productTypeSet;
//	public ArrayList<String> customerLocSet;
//	public HashMap<String, Double> customerProductType2weight;
//	
//	public HashMap<String, Double> cusLocationId2limitedWeight;
//	public HashMap<String, String> cusLocationId2startTime;
//	public HashMap<String, String> cusLocationId2endTime;
//	public HashMap<String, Double> cusLocationId2unloadPerUnit;
//	public HashMap<String, Double> cusLocationId2waitingDuration;
//	
//	public HashMap<String, ArrayList<Point>> depotLocationId2points;
//	
//	public HashMap<String, Double> vhCode2upperCapacity;
//	public HashMap<String, Double> vhCode2lowerCapacity;
//	public HashMap<String, String[]> vhCode2typeOfProduct;
//	public HashMap<String, Integer> vhCode2nbTrips;
//	public HashMap<String, Integer> vhCode2ownership;
//	public HashMap<String, String> vhCode2locationId;
//	public HashMap<String, Double> vhCode2weight;
//	public HashMap<Point, String> startPoint2vhCode;
//	
//	public static int nVehicle;
//	public static int nRequest;
//	double profit = 0;
//	
//	
//	VRManager mgr;
//	VarRoutesVR XR;
//	ArcWeightsManager awm;
//	Constraints ctrs;
//	IFunctionVR objective;
//	LexMultiValues valueSolution;
//	AdaptRoutes adR;
//	
//	public HashMap<String, ArrayList<Point>> depotLoc2customerPoints;
//	
//	HashMap<Point, Integer> nChosed;
//	HashMap<Point, Boolean> removeAllowed;
//	
//	private int nRemovalOperators = 8;
//	private int nInsertionOperators = 8;
//	
//	//parameters
//	public int lower_removal;
//	public int upper_removal;
//	public int sigma1 = 3;
//	public int sigma2 = 1;
//	public int sigma3 = -5;
//	public double rp = 0.1;
//	public int nw = 1;
//	public double shaw1st = 0.5;
//	public double shaw2nd = 0.2;
//	public double shaw3rd = 0.1;
//	public double temperature = 200;
//	public double cooling_rate = 0.9995;
//	public int nTabu = 5;
//	int timeLimit = 18000000;
//	int nIter = 10000;
//	int maxStable = 100;
//
//	public MDMTPSolverHamTaoDuLieuChayChinhXacDeSoSanh() {
//		
//	}
//	
//	public void init() {
//		this.nVehicle = input.getVehicle().length;
//		allPoints = new ArrayList<Point>();
//		locationId2Point = new HashMap<String, Point>();
//		
//		earliestAllowedArrivalTime = new HashMap<Point, Integer>();
//		serviceDuration = new HashMap<Point, Double>();
//		waittingDuration = new HashMap<Point, Integer>();
//		lastestAllowedArrivalTime = new HashMap<Point, Integer>();
//		
//		startPoints = new ArrayList<Point>();
//		endPoints = new ArrayList<Point>();
//		depotPoints = new ArrayList<Point>();
//		customerPoints = new ArrayList<Point>();
//		rejectedPoints = new ArrayList<Point>();
//		point2mark = new HashMap<Point, Integer>();
//		
//		parking2startTime = new HashMap<String, String>();
//		parking2endTime = new HashMap<String, String>();
//		for(int i = 0; i < input.getParking().length; i++){
//			Parking prk = input.getParking()[i];
//			parking2startTime.put(prk.getLocationId(), prk.getStartWorkingTime());
//			parking2endTime.put(prk.getLocationId(), prk.getEndWorkingTime());
//		}
//		
//		int id = 0;
//		id2locationId = new HashMap<Integer, String>();
//		vhCode2upperCapacity = new HashMap<String, Double>();
//		vhCode2lowerCapacity = new HashMap<String, Double>();
//		vhCode2typeOfProduct = new HashMap<String, String[]>();//vehicle cannot carry these products
//		vhCode2nbTrips = new HashMap<String, Integer>();
//		vhCode2ownership = new HashMap<String, Integer>();
//		vhCode2locationId = new HashMap<String, String>();
//		vhCode2weight = new HashMap<String, Double>();
//		startPoint2vhCode = new HashMap<Point, String>();
//
//		for(int i = 0; i < input.getVehicle().length; i++) {
//			Vehicle vh = input.getVehicle()[i];
//			String vhCode = vh.getVehicleCode();
//			vhCode2upperCapacity.put(vhCode, vh.getUpperLoadRate()*vh.getWeight());
//			vhCode2lowerCapacity.put(vhCode, vh.getLowerLoadRate()*vh.getWeight()*0.25);
//			vhCode2typeOfProduct.put(vhCode, vh.getRestrictedProducts());
//			vhCode2nbTrips.put(vhCode, vh.getNbTrips());
//			vhCode2ownership.put(vhCode, vh.getOwnership());
//			vhCode2locationId.put(vhCode, vh.getLocaionId());
//			vhCode2weight.put(vhCode, vh.getWeight());
//			
//			Point p = new Point(id, vh.getLocaionId(),
//					Utils.PARKING, "", 0, Utils.INF);
//			startPoints.add(p);
//			startPoint2vhCode.put(p, vhCode);
//			allPoints.add(p);
//			locationId2Point.put(p.getLocationId(), p);
//			id2locationId.put(id, p.locationId);
//			
//			earliestAllowedArrivalTime.put(p, 
//					(int)DateTimeUtils.dateTime2Int(parking2startTime.get(vh.getLocaionId())));
//			serviceDuration.put(p, 0.0);
//			waittingDuration.put(p, 0);
//			lastestAllowedArrivalTime.put(p, 
//					(int)DateTimeUtils.dateTime2Int(parking2endTime.get(vh.getLocaionId())));
//			id++;
//			
//			Point q = new Point(id, vh.getLocaionId(),
//					Utils.PARKING, "", 0, Utils.INF);
//			endPoints.add(q);
//			allPoints.add(q);
//			locationId2Point.put(q.getLocationId(), q);
//			id2locationId.put(id, q.locationId);
//			
//			earliestAllowedArrivalTime.put(q, 
//					(int)DateTimeUtils.dateTime2Int(parking2startTime.get(vh.getLocaionId())));
//			serviceDuration.put(q, 0.0);
//			waittingDuration.put(q, 0);
//			lastestAllowedArrivalTime.put(q, 
//					(int)DateTimeUtils.dateTime2Int(parking2endTime.get(vh.getLocaionId())));
//			id++;
//		}
//		
//		depotLocationId2points = new HashMap<String, ArrayList<Point>>();
//		for(int i = 0; i < input.getDistributionCenter().length; i++) {
//			DistributionCenter depot = input.getDistributionCenter()[i];
//			ArrayList<Point> depotLogicalPoints = new ArrayList<Point>();
//			for(int j = 0; j < nVehicle; j++) {
//				for(int k = 0; k < input.getVehicle()[j].getNbTrips(); k++) {
//					Point p = new Point(id, depot.getLocationId(),
//							Utils.DEPOT, "", 0, Utils.INF);
//					depotLogicalPoints.add(p);
//					depotPoints.add(p);
//					allPoints.add(p);
//					locationId2Point.put(p.getLocationId(), p);
//					id2locationId.put(id, p.locationId);
//					
//					earliestAllowedArrivalTime.put(p, 
//							(int)DateTimeUtils.dateTime2Int(depot.getStartWorkingTime()));
//					serviceDuration.put(p, depot.getLoadDurationPerUnit());
//					waittingDuration.put(p, (int)(depot.getWaittingDuration()));
//					lastestAllowedArrivalTime.put(p, 
//							(int)DateTimeUtils.dateTime2Int(depot.getEndWorkingTime()));
//					id++;
//				}
//			}
//			depotLocationId2points.put(depot.getLocationId(), depotLogicalPoints);
//		}
//		
//		cusLocationId2limitedWeight = new HashMap<String, Double>();
//		cusLocationId2startTime = new HashMap<String, String>();
//		cusLocationId2endTime = new HashMap<String, String>();
//		cusLocationId2unloadPerUnit = new HashMap<String, Double>();
//		cusLocationId2waitingDuration = new HashMap<String, Double>();
//		for(int i = 0; i < input.getCustomer().length; i++) {
//			Customer c = input.getCustomer()[i];
//			cusLocationId2startTime.put(c.getLocationId(), c.getStartWorkingTime());
//			cusLocationId2endTime.put(c.getLocationId(), c.getEndWorkingTime());
//			cusLocationId2limitedWeight.put(c.getLocationId(), c.getLimitedWeight());
//			cusLocationId2unloadPerUnit.put(c.getLocationId(), c.getUnloadDurationPerUnit());
//			cusLocationId2waitingDuration.put(c.getLocationId(), c.getWaittingDuration());
//		}
//		
//		productCode2type = new HashMap<String, String>();
//		productCode2grssWeight = new HashMap<String, Double>();
//		for(int i = 0; i < input.getProduct().length; i++) {
//			Product p = input.getProduct()[i];
//			double w = p.getGrssWeight();
//			String s = w + "";
//			if(s.equals("NaN"))
//				w = 0.0001;
//			productCode2grssWeight.put(p.getProductCode(), p.getGrssWeight());
//			productCode2type.put(p.getProductCode(), p.getType());
//		}
//		
//		customerProductType2weight = new HashMap<String, Double>();
//		productTypeSet = new ArrayList<String>();
//		customerLocSet = new ArrayList<String>();
//		
//		for(int i = 0; i < input.getOrder().length; i++){
//			Order ord = input.getOrder()[i];
//			String cusLocationId = ord.getShiptoCode();
//			String productType = productCode2type.get(ord.getOrderItem());
//			String key = cusLocationId + "-" + productType;
//			
//			if(customerProductType2weight.get(key) == null) {
//				if(customerLocSet.size() >= 150)
//					break;
//				customerProductType2weight.put(key, 
//					ord.getQuantity()*productCode2grssWeight.get(ord.getOrderItem()));
//				customerLocSet.add(cusLocationId);
//				if(!productTypeSet.contains(productType))
//					productTypeSet.add(productType);
//			}
//			else {
//				double w = customerProductType2weight.get(key);
//				w += ord.getQuantity() * productCode2grssWeight.get(ord.getOrderItem());
//				customerProductType2weight.put(key, w);
//			}
//		}
//		
////		try{
////			FileOutputStream write = new FileOutputStream("data\\vinamilk\\summary-orders-VNM-HCM-orders-2019-09-21.txt");
////			PrintWriter fo = new PrintWriter(write);
////			fo.println("CustomerLocationId  ProductType  Weight");
////			
////			fo.close();
////		}catch(Exception e){
////			System.out.println(e);
////		}
//		
//		for(String key : customerProductType2weight.keySet()) {
//			String[] str = key.split("-");
//			Point p = new Point(id, str[0], 
//					Utils.CUSTOMER, str[1], 
//					customerProductType2weight.get(key), 
//					cusLocationId2limitedWeight.get(str[0]));
//			customerPoints.add(p);
//			allPoints.add(p);
//			locationId2Point.put(p.getLocationId(), p);
//			id2locationId.put(id, p.locationId);
//			
//			earliestAllowedArrivalTime.put(p, 
//					(int)DateTimeUtils.dateTime2Int(cusLocationId2startTime.get(str[0])));
//			serviceDuration.put(p, customerProductType2weight.get(key)*cusLocationId2unloadPerUnit.get(str[0]));
//			waittingDuration.put(p, (int)(cusLocationId2waitingDuration.get(str[0])*1));
//			lastestAllowedArrivalTime.put(p, 
//					(int)DateTimeUtils.dateTime2Int(cusLocationId2endTime.get(str[0])));
//			id++;
//			
//			try{
//				FileOutputStream write = new FileOutputStream("data\\vinamilk\\summary-orders-VNM-HCM-orders-2019-09-21.txt", true);
//				PrintWriter fo = new PrintWriter(write);
//				fo.println(str[0] + " " + str[1] + " " + customerProductType2weight.get(key));
//				
//				fo.close();
//			}catch(Exception e){
//				System.out.println(e);
//			}
//		}
//		
//		pair2travelTime = new HashMap<String, Double>();
//		for(int i = 0; i < input.getDistance().length; i++) {
//			Distance e = input.getDistance()[i];
//			String key = e.getFrom() + "-" + e.getTo();
//			pair2travelTime.put(key, e.getT());
//		}
//		
//		awm = new ArcWeightsManager(allPoints);
//		matrixT = new double[allPoints.size()][allPoints.size()];
//		for(int i = 0; i < allPoints.size(); i++) {
//			point2mark.put(allPoints.get(i), 0);
//			for(int j = 0; j < allPoints.size(); j++) {
//				String fromLocation = id2locationId.get(i);
//				String toLocation = id2locationId.get(j);
//				String pair = fromLocation + "-" + toLocation;
//				double w = waittingDuration.get(allPoints.get(i));
//				double t = pair2travelTime.get(pair);
//				if(!fromLocation.equals(toLocation))
//					t += w;
//				matrixT[i][j] = t;
//				awm.setWeight(allPoints.get(i), allPoints.get(j), t);
//			}
//		}
//	}
//	
//	public void stateModel() {
//		mgr = new VRManager();
//		XR = new VarRoutesVR(mgr);
//		
//		ctrs = new Constraints(earliestAllowedArrivalTime, serviceDuration, 
//				waittingDuration, lastestAllowedArrivalTime, 
//				matrixT, vhCode2upperCapacity, vhCode2lowerCapacity,vhCode2weight, 
//				vhCode2typeOfProduct, vhCode2nbTrips, startPoint2vhCode,
//				cusLocationId2limitedWeight, mgr, XR);
//		adR = new AdaptRoutes(this);
//		for(int i = 0; i < startPoints.size(); ++i)
//			XR.addRoute(startPoints.get(i), endPoints.get(i));
//		
//		for(int i = 0; i < depotPoints.size(); ++i)
//			XR.addClientPoint(depotPoints.get(i));
//		for(int i = 0; i < customerPoints.size(); ++i)
//			XR.addClientPoint(customerPoints.get(i));
//		objective = new TotalCostVR(XR, awm, vhCode2lowerCapacity, 
//				vhCode2upperCapacity, startPoint2vhCode);
//		mgr.close();
//		
//	}
//	
//	public Point getNearestPointFromPoint(Point x, ArrayList<Point> points) {
//		double d = Utils.INF;
//		Point nearestPoint = null;
//		ArrayList<String> checkedLocationId = new ArrayList<String>();
//		for(int i = 0; i < points.size(); i++) {
//			Point p = points.get(i);
//			if(nearestPoint != null && checkedLocationId.contains(p.getLocationId()))
//				continue;
//			if(matrixT[p.getID()][x.getID()] < d) {
//				d = matrixT[p.getID()][x.getID()];
//				nearestPoint = p;
//			}
//			checkedLocationId.add(p.getLocationId());
//		}
//		return nearestPoint;
//	}
//	
//	public Point getNearestAvailablePointFromPoint(Point x, ArrayList<Point> points, ArrayList<Point> retrictedPoints) {
//		double d = Utils.INF;
//		Point nearestPoint = null;
//		ArrayList<String> checkedLocationId = new ArrayList<String>();
//		for(int i = 0; i < points.size(); i++) {
//			Point p = points.get(i);
//			if((nearestPoint != null && checkedLocationId.contains(p.getLocationId()))
//				|| XR.route(p) != Constants.NULL_POINT
//				|| point2mark.get(p) == 1
//				|| retrictedPoints.contains(p))
//				continue;
//			if(matrixT[p.getID()][x.getID()] < d) {
//				d = matrixT[p.getID()][x.getID()];
//				nearestPoint = p;
//			}
//			checkedLocationId.add(p.getLocationId());
//		}
//		if(nearestPoint == null) {
//			System.out.println("cannot find the depot!");
//			System.exit(-1);
//		}
//		return nearestPoint;
//	}
//	
//	public Point getNearestAvailablePointFromPoint(Point x, ArrayList<Point> points) {
//		double d = Utils.INF;
//		Point nearestPoint = null;
//		ArrayList<String> checkedLocationId = new ArrayList<String>();
//		for(int i = 0; i < points.size(); i++) {
//			Point p = points.get(i);
//			if((checkedLocationId.contains(p.getLocationId()) && nearestPoint != null)
//				|| XR.route(p) != Constants.NULL_POINT
//				|| point2mark.get(p) == 1)
//				continue;
//			if(matrixT[p.getID()][x.getID()] < d) {
//				d = matrixT[p.getID()][x.getID()];
//				nearestPoint = p;
//			}
//			checkedLocationId.add(p.getLocationId());
//		}
//		if(nearestPoint == null) {
//			System.out.println("cannot find the depot!");
//			System.exit(-1);
//		}
//		return nearestPoint;
//	}
//	
//	public Point getAvailablePoint(String locationId, ArrayList<Point> points) {
//		for(int i = 0; i < points.size(); i++) {
//			Point p = points.get(i);
//			if(XR.route(p) == Constants.NULL_POINT
//				&& p.getLocationId().equals(locationId))
//				return p;
//		}
//		return null;
//	}
//	
//	//clustering customer points to depots with small travel time
//	public void customerClusters() {
//		depotLoc2customerPoints = new HashMap<String, ArrayList<Point>>();
//		for(int i = 0; i < customerPoints.size(); i++) {
//			Point nearestPoint = getNearestPointFromPoint(customerPoints.get(i), depotPoints);
//			if(depotLoc2customerPoints.get(nearestPoint.getLocationId()) == null) {
//				ArrayList<Point> points = new ArrayList<Point>();
//				points.add(customerPoints.get(i));
//				depotLoc2customerPoints.put(nearestPoint.getLocationId(), points);
//			}
//			else {
//				ArrayList<Point> points = depotLoc2customerPoints.get(nearestPoint.getLocationId());
//				points.add(customerPoints.get(i));
//				depotLoc2customerPoints.put(nearestPoint.getLocationId(), points);
//			}
//		}
//		
//		//sort by weight
//		for(String depotLoc : depotLoc2customerPoints.keySet()) {
//			ArrayList<Point> c = depotLoc2customerPoints.get(depotLoc);
//			ArrayList<Point> newCustomerPoints = new ArrayList<Point>();
//			int n = c.size();
//			for(int i = 0; i < n; i++) {
//				double w = -1;
//				Point max = null;
//				for(Point p : c) {
//					if(p.getOrderWeight() > w) {
//						w = p.getOrderWeight();
//						max = p;
//					}
//				}
//				newCustomerPoints.add(max);
//				c.remove(max);
//			}
//			depotLoc2customerPoints.put(depotLoc, newCustomerPoints);
//		}
//	}
//	
//	public void removeViolationPoints() {
//		//System.out.println("remove");
//		for(int r = 1; r <= XR.getNbRoutes(); r++) {
//			Point st = XR.getStartingPointOfRoute(r);
//			String vhCode = startPoint2vhCode.get(st);
//			double acmWeight = 0;
//			ArrayList<Point> removedPoints = new ArrayList<Point>();
//			removedPoints.add(XR.next(st));
//			for(Point p = XR.next(st);
//					p != null; p = XR.next(p)) {
//				acmWeight += p.getOrderWeight();
//				if(p.getTypeOfPoint().equals(Utils.DEPOT) 
//						|| p.getTypeOfPoint().equals(Utils.PARKING)) {
//					if(acmWeight < vhCode2lowerCapacity.get(vhCode)
//						&& acmWeight > 0) {
////						System.out.println("acmWeight = " + acmWeight + ", lower = " + vhCode2lowerCapacity.get(vhCode) + ", upper = " + vhCode2upperCapacity.get(vhCode));
////						System.out.println("arrival time = " + point2arrivalTime.get(p) + ", latest = " + lastestAllowedArrivalTime.get(p));
//						
//						for(Point rp : removedPoints) {
//							mgr.performRemoveOnePoint(rp);
//							point2mark.put(rp, 0);
//						}
//					}
//					acmWeight = 0;
//					removedPoints.clear();
//				}
//				removedPoints.add(p);
//			}
//		}
//	}
//	
//	public void calculateArrivalTimeAtEachPoint() {
//		point2arrivalTime = new HashMap<Point, Integer>();
//		for(int r = 1; r <= XR.getNbRoutes(); r++) {
//			HashMap<Point, Integer> loadDurations = new HashMap<Point, Integer>();
//			int acmLoadDuration = 0;
//			Point depot = null;
//			Point st = XR.getStartingPointOfRoute(r);
//			for(Point p = st; p != null; p = XR.next(p)) {
//				acmLoadDuration += serviceDuration.get(p);
//				if(p.getTypeOfPoint().equals(Utils.DEPOT)) {
//					if(depot == null)
//						depot = p;
//					else {
//						loadDurations.put(depot, acmLoadDuration);
//						depot = p;
//						acmLoadDuration = 0;
//					}
//				}
//				else if(p.getTypeOfPoint().equals(Utils.PARKING)) {
//					if(depot != null)
//						loadDurations.put(depot, acmLoadDuration);
//				}
//			}
//			int startServiceTime = earliestAllowedArrivalTime.get(st);
//			point2arrivalTime.put(st, startServiceTime);
//			for(Point p = XR.next(st); p != null; p = XR.next(p)) {
//				startServiceTime += matrixT[XR.prev(p).ID][p.ID];
//				if(startServiceTime < earliestAllowedArrivalTime.get(p))
//					startServiceTime = earliestAllowedArrivalTime.get(p);
//				startServiceTime += 0;//waittingDuration.get(p);
//				startServiceTime += serviceDuration.get(p);
//				if(p.getTypeOfPoint().equals(Utils.DEPOT))
//					startServiceTime += loadDurations.get(p);
//				point2arrivalTime.put(p, startServiceTime);
//			}
//		}
//	}
//	
//	public int getNbUsedVehicles() {
//		int nb = 0;
//		for(int r = 1; r <= XR.getNbRoutes(); r++)
//			if(XR.next(XR.getStartingPointOfRoute(r)) != XR.getTerminatingPointOfRoute(r))
//				nb++;
//		return nb;
//	}
//	
//	public void calculateProfit() {
//		double alpha1 = 1;//cost per meter
//		double alpha2 = 10;//cost per unit weight
//		double alpha5 = 2;//cost per unit weight
//		profit = 0;
//		int nbUsedVehicles = 0;
//		for(int r = 1; r <= XR.getNbRoutes(); r++) {
//			Point st = XR.getStartingPointOfRoute(r);
//			for(Point p = XR.next(st); p != null; p = XR.next(p)) {
//				profit += p.getOrderWeight()*alpha2;
//				profit -= matrixT[p.getID()][XR.prev(p).getID()]*alpha1;
//			}
//			if(XR.next(st) != XR.getTerminatingPointOfRoute(r)) {
//				profit -= vhCode2upperCapacity.get(startPoint2vhCode.get(st))*alpha5;
//				nbUsedVehicles++;
//			}
//		}
//	}
//	
//	public void printSolution(String outputFile) {
//		calculateArrivalTimeAtEachPoint();
//		
//		//calculateProfit();
//		try{	
//			FileOutputStream write = new FileOutputStream(outputFile, true);
//			PrintWriter fo = new PrintWriter(write);
//			fo.println("======Searching done======");
//			fo.println("Objective-NbServedCustomers-NbUsedVehicles");
//			fo.println(objective.getValue()
//					+ "-" + getNbServedCustomers()
//					+ "-" + getNbUsedVehicles());
//			fo.close();
//		}catch(Exception e){
//			System.out.println(e);
//		}
//		
//		int K = XR.getNbRoutes();
//		String s = "";
//		for(int k=1; k<=K; k++){
//			double acmWeight = 0;
//			Point x = XR.getStartingPointOfRoute(k);
//			if(XR.next(x) == XR.getTerminatingPointOfRoute(k))
//				continue;
//			s += "route[" + k + "] = ";
//			for(; x != XR.getTerminatingPointOfRoute(k); x = XR.next(x)){
//				acmWeight += x.getOrderWeight();
//				s = s + x.getID() + "(" + x.getTypeOfPoint() + "-" + acmWeight 
//					+ "-" + point2arrivalTime.get(x) + " -> ";
//				if(x.getTypeOfPoint().equals(Utils.DEPOT))
//					acmWeight = 0;
//			}
//			x = XR.getTerminatingPointOfRoute(k);
//			s = s + x.getID() + "(" + x.getTypeOfPoint() + "-" + acmWeight 
//					+ "-" + point2arrivalTime.get(x) + "\n";
//			
//		}		
//		System.out.println(s);
//		try{
//			
//			FileOutputStream write = new FileOutputStream(outputFile, true);
//			PrintWriter fo = new PrintWriter(write);
//			fo.println(s);
//			fo.close();
//		}catch(Exception e){
//			System.out.println(e);
//		}
//	}
//	
//	public void updateRoute(HashMap<Integer, ArrayList<Point>> routeList) {
//		//System.out.println("routeList" + routeList.size());
//		for(int r : routeList.keySet()) {
//			Point st = XR.getStartingPointOfRoute(r);
//			Point tp = XR.getTerminatingPointOfRoute(r);
//			Point x = st;
//			Point nextX = XR.next(st);
//			while(nextX != tp) {
//				x = nextX;
//				nextX = XR.next(x);
//				mgr.performRemoveOnePoint(x);
//				point2mark.put(x, 0);
//			}
//		}
//		for(int r : routeList.keySet()) {
//			//System.out.println("r" + r + ", nb = " + XR.index(XR.getTerminatingPointOfRoute(r)));
//			Point st = XR.getStartingPointOfRoute(r);
//			Point tp = XR.getTerminatingPointOfRoute(r);
//			Point x = st;
//			//System.out.println("st" + st.getID() + ", tp" + tp.getID());
//			ArrayList<Point> newRoute = routeList.get(r);
//			for(int i = 1; i < newRoute.size() - 1; i++) {
////				if(newRoute.get(i).getTypeOfPoint().equals(Utils.DEPOT))
////					System.out.println("Id = " + newRoute.get(i).getID() + "-" + point2mark.get(newRoute.get(i)));
////				System.out.println(newRoute.get(i).getID() + "-" + x.getID());
//				mgr.performAddOnePoint(newRoute.get(i), x);
//				x = newRoute.get(i);
//				point2mark.put(x, 1);
//			}
//		}
//	}
//	
//	public void removeDepotPointFromRoute(int r) {
//		for(Point p = XR.getStartingPointOfRoute(r); p != XR.getTerminatingPointOfRoute(r); p = XR.next(p)) {
//			if(p.getTypeOfPoint().equals(Utils.DEPOT)) {
//				Point preP = XR.prev(p);
//				mgr.performRemoveOnePoint(p);
//				point2mark.put(p, 0);
//				p = preP;
//				continue;
//			}
//		}
//	}
//	
//	public void removeDepotPointAllRoutes() {
//		for(int r = 1; r <= XR.getNbRoutes(); r++)
//			removeDepotPointFromRoute(r);
//	}
//	
//	public void addDepotPointsToRoute(int r) {
//		Point st = XR.getStartingPointOfRoute(r);
//		Point tp = XR.getTerminatingPointOfRoute(r);
//		Point dpAdded = null;
//		if(XR.next(st) == tp)
//			return;
//		if(!XR.next(st).getTypeOfPoint().equals(Utils.DEPOT)) {
//			dpAdded = getNearestAvailablePointFromPoint(st, depotPoints);
//			mgr.performAddOnePoint(dpAdded, st);
//			point2mark.put(dpAdded, 1);
//			
//		}
//		double acmWeight = 0;
//		String vhCode = startPoint2vhCode.get(st);
//		for(Point p = st; p != tp; p = XR.next(p)) {
//			acmWeight += p.getOrderWeight();
//			if(acmWeight > vhCode2upperCapacity.get(vhCode)) {
//				dpAdded = getNearestAvailablePointFromPoint(st, depotPoints);
//				mgr.performAddOnePoint(dpAdded, st);
//				point2mark.put(dpAdded, 1);
//			}
//			if(p.getTypeOfPoint().equals(Utils.DEPOT) 
//				|| p.getTypeOfPoint().equals(Utils.PARKING))
//				acmWeight = 0;
//		}
//	}
//	
//	public void addDepotToAllRoutes() {
//		for(int r = 1; r <= XR.getNbRoutes(); r++)
//			addDepotPointsToRoute(r);
//	}
//	
//	public void search(String outputFile) {
//		initParamsForALNS();
//		
//		int it = 0;
//		
//    	int iS = 0;
//    	
//    	
//    	//insertion operators selection probabilities
//		double[] pti = new double[nInsertionOperators];
//		//removal operators selection probabilities
//		double[] ptd = new double[nRemovalOperators];
//		
//		//wi - number of times used during last iteration
//		int[] wi = new int[nInsertionOperators];
//		int[] wd = new int[nRemovalOperators];
//		
//		//pi_i - score of operator
//		int[] si = new int[nInsertionOperators];
//		int[] sd = new int[nRemovalOperators];
//		
//		
//		//init probabilites
//		for(int i=0; i<nInsertionOperators; i++){
//			pti[i] = 1.0/nInsertionOperators;
//			wi[i] = 1;
//			si[i] = 0;
//		}
//		for(int i=0; i<nRemovalOperators; i++){
//			ptd[i] = 1.0/nRemovalOperators;
//			wd[i] = 1;
//			sd[i] = 0;
//		}
//    	
//		double best_cost = objective.getValue();
//		int best_nbUsedVehicles = getNbUsedVehicles();
//		int best_nbServedReqs = getNbServedCustomers();
//
//		MDMTPsolution best_solution = new MDMTPsolution(XR, point2arrivalTime, best_cost, 
//				best_nbUsedVehicles, best_nbServedReqs, rejectedPoints);
//
//		double start_search_time = System.currentTimeMillis();
//		try{
//			
//			FileOutputStream write = new FileOutputStream(outputFile, true);
//			PrintWriter fo = new PrintWriter(write);
//			fo.println("time limit = " + timeLimit + ", nbIters = " + nIter + ", maxStable = " + maxStable);
//			fo.println("#Request = " + nRequest);
//			fo.println("iter=====insertion=====removal=====time=====cost=====nbServedReqs=====nbVehicles");
//			fo.println("0 -1 -1 " + " " + System.currentTimeMillis()/1000 + " " 
//			+ best_cost + " " + best_nbServedReqs + " " + best_nbUsedVehicles);
//			fo.close();
//		}catch(Exception e){
//			System.out.println(e);
//		}
//		while( (System.currentTimeMillis()-start_search_time) < timeLimit && it++ < nIter){
//			System.out.println("nb of iterator: " + it);
//			double current_cost = objective.getValue();
//			int current_nbTrucks = getNbUsedVehicles();
//			int current_nbServedReqs = getNbServedCustomers();
//			MDMTPsolution current_solution = new MDMTPsolution(XR, point2arrivalTime, 
//					current_cost, current_nbTrucks,
//					current_nbServedReqs, rejectedPoints);
//			
//			removeDepotPointAllRoutes();
//			
//			int i_selected_removal = -1;
//			if(iS >= maxStable){
//				adR.allRemoval();
//				iS = 0;
//			}
//			else{
//				i_selected_removal = get_operator(ptd);
//				//i_selected_removal = idxRemoval;
//				wd[i_selected_removal]++;
//				switch(i_selected_removal){
//					case 0: adR.routeRemovalOperator(); break;
//					case 1: adR.randomRequestRemovalOperator(); break;
//					case 2: adR.shawRemovalOperator(); break;
//					case 3: adR.worstRemovalOperator(); break;
//					case 4: adR.forbidden_removal(0); break;
//					case 5: adR.forbidden_removal(1); break;
//					case 6: adR.forbidden_removal(2); break;
//					case 7: adR.forbidden_removal(3); break;
//				}
//			}
//			
//			
//			int i_selected_insertion = get_operator(pti);
//			//int i_selected_insertion =idxRemoval ;
//			wi[i_selected_insertion]++;
//			switch(i_selected_insertion){
//				case 0: adR.greedyInsertion(); break;
//				case 1: adR.greedyInsertionWithNoise(); break;
//				case 2: adR.regret_n_insertion(2); break;
//				case 3: adR.first_possible_insertion(); break;
//				case 4: adR.sort_before_insertion(0); break;
//				case 5: adR.sort_before_insertion(1); break;
//				case 6: adR.sort_before_insertion(2); break;
//				case 7: adR.sort_before_insertion(3); break;
//			}
//			
//			addDepotToAllRoutes();
//			calculateArrivalTimeAtEachPoint();
//			
//			int new_nb_served_points = getNbServedCustomers();
//			double new_cost = objective.getValue();
//			int new_nbTrucks = getNbUsedVehicles();
//
//			if( new_nb_served_points > current_nbServedReqs
//					|| (new_nb_served_points == current_nbServedReqs && new_cost < current_cost)){
//				int best_nb_served_points = best_solution.get_nbServedReqs();
//				int best_nbTrucks = best_solution.get_nbVehicles();
//				
//				if(new_nb_served_points > best_nb_served_points
//						|| (new_nb_served_points == best_nb_served_points && new_cost < best_cost)){
//					
//					best_cost = new_cost;
//					best_solution = new MDMTPsolution(XR, point2arrivalTime, best_cost, 
//							best_nbTrucks, best_nb_served_points, rejectedPoints);
//					try{
//						FileOutputStream write = new FileOutputStream(outputFile, true);
//						PrintWriter fo = new PrintWriter(write);
//						fo.println(it + " " + i_selected_insertion 
//							+ " " + i_selected_removal + " "
//							+ System.currentTimeMillis()/1000 + " "
//							+ best_cost + " " + best_nb_served_points + " " + best_nbTrucks);
//						fo.close();
//					}catch(Exception e){
//						System.out.println(e);
//					}
//					si[i_selected_insertion] += sigma1;
//					if(i_selected_removal >= 0)
//						sd[i_selected_removal] += sigma1;
//				}
//				else{
//					si[i_selected_insertion] += sigma2;
//					if(i_selected_removal >= 0)
//						sd[i_selected_removal] += sigma2;
//				}
//			}
//			/*
//			 * if new solution has cost worst than current solution
//			 * 		because XR is new solution
//			 * 			copy current current solution to new solution if don't change solution
//			 */
//			else{
//				si[i_selected_insertion] += sigma3;
//				if(i_selected_removal >= 0)
//					sd[i_selected_removal] += sigma3;
//				double v = Math.exp(-(new_cost-current_cost)/temperature);
//				double e = Math.random();
//				if(e >= v){
//					current_solution.copy2XR(XR);
//					rejectedPoints = current_solution.get_rejectPoints();
//				}
//				iS++;
//			}
//			
//			temperature = cooling_rate*temperature;
//			
//			//update probabilities
//			if(it % nw == 0){
//				for(int i=0; i<nInsertionOperators; i++){
//					pti[i] = Math.max(0.0001, pti[i]*(1-rp) + rp*si[i]/wi[i]);
//					//wi[i] = 1;
//					//si[i] = 0;
//				}
//				
//				for(int i=0; i<nRemovalOperators; i++){
//					ptd[i] = Math.max(0.0001, ptd[i]*(1-rp) + rp*sd[i]/wd[i]);
//					//wd[i] = 1;
//					//sd[i] = 0;
//				}
//			}
//		}
//		best_solution.copy2XR(XR);
//
//		rejectedPoints = best_solution.get_rejectPoints();
//		try{
//			FileOutputStream write = new FileOutputStream(outputFile, true);
//			PrintWriter fo = new PrintWriter(write);
//			fo.println(it + " -1 -1 "
//					+ System.currentTimeMillis()/1000 + " "
//					+ best_cost + " " + getNbServedCustomers() + " " + getNbUsedVehicles());
//			fo.close();
//		}catch(Exception e){
//			System.out.println(e);
//		}
//	}
//	
//	public int getNbServedCustomers() {
//		int nb = 0;
//		rejectedPoints.clear();
//		for(int i = 0; i < customerPoints.size(); i++) {
//			if(XR.route(customerPoints.get(i)) != Constants.NULL_POINT)
//				nb++;
//			else
//				rejectedPoints.add(customerPoints.get(i));
//		}
//		return nb;
//	}
//	
//	public void initParamsForALNS(){
//		lower_removal = (int)(customerPoints.size() * 0.2);
//		upper_removal = (int)(customerPoints.size() * 0.4);
//		nChosed = new HashMap<Point, Integer>();
//		removeAllowed = new HashMap<Point, Boolean>();
//		for(int i=0; i<customerPoints.size(); i++){
//			Point pi = customerPoints.get(i);
//			nChosed.put(pi, 0);
//			removeAllowed.put(pi, true);
//		}
//	}
//	
//	private int get_operator(double[] p){
// 		//String message = "probabilities input \n";
// 		
// 		int n = p.length;
//		double[] s = new double[n];
//		s[0] = 0+p[0];
//
//		
//		for(int i=1; i<n; i++)
//			s[i] = s[i-1]+p[i]; 
//		
//		double r = s[n-1]*Math.random();
//		
//		if(r>=0 && r <= s[0])
//			return 0;
//		
//		for(int i=1; i<n; i++){
//			if(r>s[i-1] && r<=s[i])
//				return i;
//		}
//		return -1;
//	}
//	
//	public void createFileToMIP(String dir) {
//		String fileName = dir + "-MILP.txt";
//		ArrayList<String> locOrders = new ArrayList<String>();
//		try {
//			PrintWriter f = new PrintWriter(new File(fileName));
//			f.println("#nbCustomers");
//			f.println(customerLocSet.size());
//			
//			f.println("#nbParkings");
//			f.println(parking2startTime.size());
//			
//			f.println("#nbCentralDepots");
//			f.println(depotLocationId2points.size());
//			
//			HashMap<String, ArrayList<String>> prk2vhCodes = new HashMap<String, ArrayList<String>>();
//			ArrayList<String> order2prkCode = new ArrayList<String>();
//			int nbVhs = 0;
//			for(String prkCode : parking2startTime.keySet()) {
//				ArrayList<String> vhCodes = new ArrayList<String>();
//				for(String vh : vhCode2locationId.keySet()) {
//					if(vhCode2locationId.get(vh).equals(prkCode))
//						vhCodes.add(vh);
//				}
//				List<String> newVhCodes = vhCodes.subList(0, (int)(vhCodes.size()/19));
//				vhCodes = new ArrayList<String>(newVhCodes);
//				prk2vhCodes.put(prkCode, vhCodes);
//				order2prkCode.add(prkCode);
//				nbVhs += vhCodes.size();
//			}
//			
//			f.println("#nbVehicles");
//			f.println(nbVhs);
//			
//			f.println("#nbProducts");
//			f.println(productTypeSet.size());
//			
//			f.println("#parking info (nk ep lp)");
//			for(String prkCode : parking2startTime.keySet()) {
//				ArrayList<String> vhCodes = prk2vhCodes.get(prkCode);
//				f.println(vhCodes.size() + " " + (int)DateTimeUtils.dateTime2Int(parking2startTime.get(prkCode)) 
//					+ " " + (int)DateTimeUtils.dateTime2Int(parking2endTime.get(prkCode)));
//				
//				locOrders.add(prkCode);
//			}
//
//			f.println("#central depot info(ed, ld, waittingTime, loadingTimeperUnit)");
//			for(String dp : depotLocationId2points.keySet()) {
//				ArrayList<Point> depotPoints = depotLocationId2points.get(dp);
//				f.println(earliestAllowedArrivalTime.get(depotPoints.get(0))
//					+ " " + lastestAllowedArrivalTime.get(depotPoints.get(0))
//					+ " " + waittingDuration.get(depotPoints.get(0))
//					+ " " + serviceDuration.get(depotPoints.get(0)));
//				locOrders.add(dp);
//			}
//			f.println("#vehicle info(ek, lk, ck lower, ck upper, qk, outsourced)");
//			for(int i = 0; i < order2prkCode.size(); i++) {
//				ArrayList<String> vhCodes = prk2vhCodes.get(order2prkCode.get(i));
//				for(int j = 0; j < vhCodes.size(); j++) {
//					f.println((int)DateTimeUtils.dateTime2Int(parking2startTime.get(vhCode2locationId.get(vhCodes.get(j))))
//						+ " " + (int)DateTimeUtils.dateTime2Int(parking2endTime.get(vhCode2locationId.get(vhCodes.get(j))))
//						+ " " + Math.round(vhCode2lowerCapacity.get(vhCodes.get(j))*0.1)
//						+ " " + Math.round(vhCode2upperCapacity.get(vhCodes.get(j)))
//						+ " " + vhCode2nbTrips.get(vhCodes.get(j))
//						+ " " + vhCode2ownership.get(vhCodes.get(j)));
//				}
//			}
//			
//			f.println("#weight of products (wp)");
//			for(int i = 0; i < productTypeSet.size(); i++)
//				f.println("1");
//			
//			f.println("#customer demand (quantity, quantity, quantity,... nbProducts)");
//			for(int i = 0; i < customerLocSet.size(); i++) {
//				String s = "";
//				for(int j = 0; j < productTypeSet.size() - 1; j++) {
//					String key = customerLocSet.get(i) + "-" + productTypeSet.get(j);
//					if(customerProductType2weight.get(key) != null)
//						s += Math.round(customerProductType2weight.get(key)) + " ";
//					else
//						s += "0 ";
//				}
//				String key = customerLocSet.get(i) + "-" + productTypeSet.get(productTypeSet.size() - 1);
//				if(customerProductType2weight.get(key) != null)
//					s += Math.round(customerProductType2weight.get(key));
//				else
//					s += "0";
//				f.println(s);
//			}
//			
//			f.println("#customer info(ei, li, waittingTime, unloadingTimePerUnit)");
//			for(int i = 0; i < customerLocSet.size(); i++) {
//				String cusLoc = customerLocSet.get(i);
//				f.println((int)DateTimeUtils.dateTime2Int(cusLocationId2startTime.get(cusLoc))
//					+ " " + (int)DateTimeUtils.dateTime2Int(cusLocationId2endTime.get(cusLoc))
//					+ " " + Math.round(cusLocationId2waitingDuration.get(cusLoc))
//					+ " " + cusLocationId2unloadPerUnit.get(cusLoc));
//				locOrders.add(cusLoc);
//			}
//			
//			f.println("#vehicle - product (restrictly bkp) = 1: vh can carry");
//			for(int i = 0; i < order2prkCode.size(); i++) {
//				ArrayList<String> vhCodes = prk2vhCodes.get(order2prkCode.get(i));
//				for(int k = 0; k < vhCodes.size(); k++) {
//					String[] restrictedProduct = vhCode2typeOfProduct.get(vhCodes.get(k));
//					String s = "";
//					ArrayList<String> arr = new ArrayList<String>(Arrays.asList(restrictedProduct));
//					for(int j = 0; j < productTypeSet.size() - 1; j++) {
//						String prType= productTypeSet.get(j);
//						if(arr.contains(prType))
//							s += "0 ";
//						else
//							s+= "1 ";
//					}
//					String prType= productTypeSet.get(productTypeSet.size()-1);
//					if(arr.contains(prType))
//						s += "0";
//					else
//						s+= "1";
//					f.println(s);
//				}
//			}
//			f.println("#vehicles - customer (restrictly rki) = 1: vh can go to cus");
//			for(int i = 0; i < order2prkCode.size(); i++) {
//				ArrayList<String> vhCodes = prk2vhCodes.get(order2prkCode.get(i));
//				for(int k = 0; k < vhCodes.size(); k++) {
//					String s = "";
//					for(int j = 0; j < customerLocSet.size() - 1; j++) {
//						s += "1 ";
//					}
//					s += "1";
//					f.println(s);
//				}
//			}
//			
//			f.println("#vehicle - remain customers = 1: remain");
//			for(int i = 0; i < order2prkCode.size(); i++) {
//				ArrayList<String> vhCodes = prk2vhCodes.get(order2prkCode.get(i));
//				for(int k = 0; k < vhCodes.size(); k++) {
//					String s = "";
//					for(int j = 0; j < customerLocSet.size() - 1; j++) {
//						s += "0 ";
//					}
//					s += "0";
//					f.println(s);
//				}
//			}
//			
//			f.println("#travel time matrix:[from to travelTime]");
//			f.println(locOrders.size() * (locOrders.size()));
//			for(int i = 0; i < locOrders.size(); i++)
//				for(int j = 0; j < locOrders.size(); j++) {
//					String key = locOrders.get(i) + "-" + locOrders.get(j);
//					if(pair2travelTime.get(key) != null)
//						f.println(i + " " + j + " " + Math.round(pair2travelTime.get(key)));
//					else
//						f.println(i + " " + j + " 0");
//				}
//			f.close();
//		}catch(Exception e) {
//			System.out.println(e);
//		}
//	}
//	
//	public static void main(String[] args) {
//		MDMTPSolverHamTaoDuLieuChayChinhXacDeSoSanh solver = new MDMTPSolverHamTaoDuLieuChayChinhXacDeSoSanh();
//		Gson g = new Gson();
//		try{
//			String dir = "data\\vinamilk\\";
//			String dataFile = "VNM-HCM-orders-2019-09-21";
//			String jsonInFileName = dir + dataFile + ".json";
//			String outputFile = dir + dataFile + "-output.txt";
//			
//			BufferedReader in = new BufferedReader(new InputStreamReader(
//	                new FileInputStream(jsonInFileName), "UTF8"));
//			solver.input = g.fromJson(in, MDMTPInput.class);
//			
//			solver.init();
//			
//			solver.createFileToMIP(dir + dataFile);
//			
////			try{
////				FileOutputStream write = new FileOutputStream(outputFile);
////				PrintWriter fo = new PrintWriter(write);
////				fo.println("Starting time = " + DateTimeUtils.unixTimeStamp2DateTime(System.currentTimeMillis()/1000) 
////						+ ", total reqs = " + solver.nRequest
////						+ ", total vehicles = " + solver.nVehicle);
////				
////				fo.close();
////			}catch(Exception e){
////				System.out.println(e);
////			}
////			
////			System.out.println("====Create Model====");
////			solver.stateModel();
////			
////			System.out.println("====Greedy Init Solution====");
////			double t0 = System.currentTimeMillis();
////			solver.greedyInitSolution2();
////			try{
////				
////				FileOutputStream write = new FileOutputStream(outputFile, true);
////				PrintWriter fo = new PrintWriter(write);
////				fo.println("Greedy init solution");
////				fo.println("RunTime-Objective-NbServedCustomers-NbUsedVehicles");
////				fo.println((System.currentTimeMillis() - t0)/1000 
////						+ "-" + solver.objective.getValue()
////						+ "-" + solver.getNbServedCustomers()
////						+ "-" + solver.getNbUsedVehicles());
////				fo.close();
////			}catch(Exception e){
////				System.out.println(e);
////			}
////			//solver.localSearch(outputFile, 10000, 180000);
////			solver.search(outputFile);
////			
////			solver.printSolution(outputFile);
//			
//			System.out.println("Done!");
//			
//		}catch(Exception e){
//			System.out.println(e);
//		}
//	}
//	
//}
