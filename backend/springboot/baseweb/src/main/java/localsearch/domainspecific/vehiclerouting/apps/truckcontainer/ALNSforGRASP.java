package localsearch.domainspecific.vehiclerouting.apps.truckcontainer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Random;

import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.GRASPsolver;
import localsearch.domainspecific.vehiclerouting.apps.sharedaride.ShareARide;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.ContainerTruckMoocInput;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.Mooc;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.Truck;
import localsearch.domainspecific.vehiclerouting.vrp.Constants;
import localsearch.domainspecific.vehiclerouting.vrp.ConstraintSystemVR;
import localsearch.domainspecific.vehiclerouting.vrp.IFunctionVR;
import localsearch.domainspecific.vehiclerouting.vrp.VRManager;
import localsearch.domainspecific.vehiclerouting.vrp.VarRoutesVR;
import localsearch.domainspecific.vehiclerouting.vrp.entities.ArcWeightsManager;
import localsearch.domainspecific.vehiclerouting.vrp.entities.Point;
import localsearch.domainspecific.vehiclerouting.vrp.invariants.AccumulatedWeightNodesVR;
import localsearch.domainspecific.vehiclerouting.vrp.invariants.EarliestArrivalTimeVR;

public class ALNSforGRASP {
	GRASPsolver tcs;
	
	public ALNSforGRASP(GRASPsolver tcs){
		super();
		this.tcs = tcs;
	}
	
	public void allRemoval(){
		System.out.println("all removal");
		tcs.mgr.performRemoveAllClientPoints();
		for(int i = 0; i < tcs.pickupPoints.size(); i++){
			Point pickup = tcs.pickupPoints.get(i);
			if(!tcs.rejectPickupPoints.contains(pickup)){
				tcs.rejectPickupPoints.add(pickup);
				tcs.rejectDeliveryPoints.add(tcs.pickup2Delivery.get(pickup));
			}
		}
		for(int k : tcs.group2marked.keySet())
			tcs.group2marked.put(k, 0);
	}
	
	public void routeRemoval(){
		Random rand = new Random();
		ArrayList<Integer> index_rand = new ArrayList<Integer>();
		for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
			if(tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) > 1)
				index_rand.add(r);
		}
		int k = rand.nextInt(index_rand.size()) + 1;
		System.out.println("routeRemoval: index of removed route = " + k);
		Point x = tcs.XR.getStartingPointOfRoute(k);
		Point next_x = tcs.XR.next(x);
		while(next_x != tcs.XR.getTerminatingPointOfRoute(k)){
			x = next_x;
			next_x = tcs.XR.next(x);
			tcs.mgr.performRemoveOnePoint(x);
			tcs.group2marked.put(tcs.point2Group.get(x), 0);
			if(tcs.point2Type.get(x) != tcs.START_MOOC
				&& tcs.point2Type.get(x) != tcs.END_MOOC){	
				if(tcs.pickup2Delivery.keySet().contains(x))
					tcs.rejectPickupPoints.add(x);
				else 
					tcs.rejectDeliveryPoints.add(x);
			}
			tcs.nChosed.put(x, tcs.nChosed.get(x)+1);
		}
		int groupTruck = tcs.point2Group.get(tcs.XR.getStartingPointOfRoute(k));
		tcs.group2marked.put(groupTruck, 0);
	}

	public void randomRequestRemoval(){
		Random R = new Random();
		int n = R.nextInt(tcs.upper_removal-tcs.lower_removal+1) + tcs.lower_removal;
		System.out.println("randomReqRemoval:number of removed request = " + n);
		if(n >= tcs.pickupPoints.size()){
			tcs.mgr.performRemoveAllClientPoints();
			for(int i = 0; i < tcs.pickupPoints.size(); i++){
				Point pickup = tcs.pickupPoints.get(i);
				if(!tcs.rejectPickupPoints.contains(pickup)){
					tcs.rejectPickupPoints.add(pickup);
					tcs.rejectDeliveryPoints.add(tcs.pickup2Delivery.get(pickup));
				}
			}
			for(int k : tcs.group2marked.keySet())
				tcs.group2marked.put(k, 0);
		}
		else{
			List<Point> considerPoints = new ArrayList<Point>(tcs.pickupPoints);
			Collections.shuffle(considerPoints);
			for(int i = 0; i < considerPoints.size(); i++){
				if(tcs.XR.route(considerPoints.get(i)) != Constants.NULL_POINT){
					if(i >= n)
						break;
				}
				else{
					considerPoints.remove(i);
					i--;
				}
			}
			for(int i = 0; i < n; i++){
				if(tcs.rejectPickupPoints.size() == tcs.pickupPoints.size())
					break;
				Point pickup = considerPoints.get(i);
				int ridx = tcs.XR.route(pickup);
				if(ridx == Constants.NULL_POINT)
					continue;
				if(!tcs.removeAllowed.get(pickup))
					continue;
				Point delivery = tcs.pickup2Delivery.get(pickup);
				tcs.mgr.performRemoveTwoPoints(pickup, delivery);
				tcs.rejectPickupPoints.add(pickup);
				tcs.rejectDeliveryPoints.add(delivery);
				tcs.group2marked.put(tcs.point2Group.get(pickup), 0);
				tcs.group2marked.put(tcs.point2Group.get(delivery), 0);
				if(tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(ridx)) <= 1){
					int groupTruck = tcs.point2Group.get(tcs.XR.getStartingPointOfRoute(ridx));
					tcs.group2marked.put(groupTruck, 0);
				}

				tcs.nChosed.put(pickup, tcs.nChosed.get(pickup)+1);
				tcs.nChosed.put(delivery, tcs.nChosed.get(delivery)+1);
			}
		}
	}
	
	public void shaw_removal(){
		Random R = new Random();
		int nRemove = R.nextInt(tcs.upper_removal-tcs.lower_removal+1) + tcs.lower_removal;
		
		System.out.println("Shaw removal : number of request removed = " + nRemove);
		
		int ipRemove;
		
		/*
		 * select randomly request r1 and its delivery dr1
		 */
		Point r1 = null;
		int c = 0;
		do{
			if(tcs.rejectPickupPoints.size() == tcs.pickupPoints.size()
				|| c++ < tcs.pickupPoints.size()){
				r1 = null;
				break;
			}
			ipRemove = R.nextInt(tcs.pickupPoints.size());
			r1 = tcs.pickupPoints.get(ipRemove);	
		}while(nRemove > 0 && (tcs.rejectPickupPoints.contains(r1) || !tcs.removeAllowed.get(r1)));
		
		Point dr1 = null;
		if(r1 != null)
			dr1 = tcs.pickup2Delivery.get(r1);
		
		/*
		 * Remove request most related with r1
		 */
		int inRemove = 0;
		while(inRemove++ != nRemove && r1 != null && dr1 != null){
			
			Point removedPickup = null;
			Point removedDelivery = null;
			double relatedMin =  Double.MAX_VALUE;
			
			int routeOfR1 = tcs.XR.route(r1);
			/*
			 * Compute arrival time at request r1 and its delivery dr1
			 */
			//System.out.println(r1 + " " + inRemove);
			//System.out.println(routeOfR1);
			double arrivalTimeR1 = tcs.eat.getEarliestArrivalTime(tcs.XR.prev(r1))+
					tcs.serviceDuration.get(tcs.XR.prev(r1))+
					tcs.awm.getDistance(tcs.XR.prev(r1), r1);
			
			double serviceTimeR1 = 1.0*tcs.earliestAllowedArrivalTime.get(r1);
			serviceTimeR1 = arrivalTimeR1 > serviceTimeR1 ? arrivalTimeR1 : serviceTimeR1;
			
			double depatureTimeR1 = serviceTimeR1 + tcs.serviceDuration.get(r1);
			
			double arrivalTimeDR1 = tcs.eat.getEarliestArrivalTime(tcs.XR.prev(dr1))+
					tcs.serviceDuration.get(tcs.XR.prev(dr1))+
					tcs.awm.getDistance(tcs.XR.prev(dr1), dr1);
			
			double serviceTimeDR1 = 1.0*tcs.earliestAllowedArrivalTime.get(dr1);
			serviceTimeDR1 = arrivalTimeDR1 > serviceTimeDR1 ? arrivalTimeDR1 : serviceTimeDR1;
			
			double depatureTimeDR1 = serviceTimeDR1 + tcs.serviceDuration.get(dr1);
			
			tcs.rejectPickupPoints.add(r1);
			tcs.rejectDeliveryPoints.add(dr1);
			tcs.nChosed.put(r1, tcs.nChosed.get(r1)+1);
			tcs.nChosed.put(dr1, tcs.nChosed.get(dr1)+1);
			
			int ridx = tcs.XR.route(r1);
			tcs.group2marked.put(tcs.point2Group.get(r1), 0);
			tcs.group2marked.put(tcs.point2Group.get(dr1), 0);
			tcs.mgr.performRemoveTwoPoints(r1, dr1);
			
			if(tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(ridx)) <= 1){
				int groupTruck = tcs.point2Group.get(tcs.XR.getStartingPointOfRoute(ridx));
				tcs.group2marked.put(groupTruck, 0);
			}
			/*
			 * find the request is the most related with r1
			 */
			for(int k=1; k<=tcs.XR.getNbRoutes(); k++){
				Point x = tcs.XR.getStartingPointOfRoute(k);
				for(x = tcs.XR.next(x); x != tcs.XR.getTerminatingPointOfRoute(k); x = tcs.XR.next(x)){
					if(!tcs.removeAllowed.get(x))
						continue;
					Point dX = tcs.pickup2Delivery.get(x);
					if(dX == null)
						continue;
					
					/*
					 * Compute arrival time of x and its delivery dX
					 */
					double arrivalTimeX = tcs.eat.getEarliestArrivalTime(tcs.XR.prev(x))+
							tcs.serviceDuration.get(tcs.XR.prev(x))+
							tcs.awm.getDistance(tcs.XR.prev(x), x);
					
					double serviceTimeX = 1.0*tcs.earliestAllowedArrivalTime.get(x);
					serviceTimeX = arrivalTimeX > serviceTimeX ? arrivalTimeX : serviceTimeX;
					
					double depatureTimeX = serviceTimeX + tcs.serviceDuration.get(x);
					
					double arrivalTimeDX =  tcs.eat.getEarliestArrivalTime(tcs.XR.prev(dX))+
							tcs.serviceDuration.get(tcs.XR.prev(dX))+
							tcs.awm.getDistance(tcs.XR.prev(dX), dX);
					
					double serviceTimeDX = 1.0*tcs.earliestAllowedArrivalTime.get(dX);
					serviceTimeDX = arrivalTimeDX > serviceTimeDX ? arrivalTimeDX : serviceTimeDX;
					
					double depatureTimeDX = serviceTimeDX + tcs.serviceDuration.get(dX);
					
					/*
					 * Compute related between r1 and x
					 */
					int lr1x;
					if(routeOfR1 == k){
						lr1x = 1;
					}else{
						lr1x = -1;
					}
					
					double related = tcs.shaw1st*(tcs.awm.getDistance(r1, x) + tcs.awm.getDistance(dX, dr1))+
							tcs.shaw2nd*(Math.abs(depatureTimeR1-depatureTimeX) + Math.abs(depatureTimeDX-depatureTimeDR1))+
							tcs.shaw3rd*lr1x;
					if(related < relatedMin){
						relatedMin = related;
						removedPickup = x;
						removedDelivery = dX;
					}
				}
			}
			
			r1 = removedPickup;
			dr1 = removedDelivery;
			if(r1 != null){
				tcs.nChosed.put(r1, tcs.nChosed.get(r1)+1);
				tcs.nChosed.put(dr1, tcs.nChosed.get(dr1)+1);
			}
		}
		
	}
	
	public void worst_removal(){
		Random R = new Random();
		int nRemove = R.nextInt(tcs.upper_removal-tcs.lower_removal+1) + tcs.lower_removal;
		//System.out.println("worstRemoval: nRemove = " + nRemove);
		
		int inRemove = 0;
		int c = 0;
		while(inRemove++ != nRemove && c++ < tcs.pickupPoints.size()){
			if(tcs.rejectPickupPoints.size() == tcs.pickupPoints.size())
				break;
			double maxCost = Double.MIN_VALUE;
			Point removedPickup = null;
			Point removedDelivery = null;
			
			for(int k=1; k<=tcs.XR.getNbRoutes(); k++){
				Point x = tcs.XR.getStartingPointOfRoute(k);
				for(x = tcs.XR.next(x); x != tcs.XR.getTerminatingPointOfRoute(k); x = tcs.XR.next(x)){
					
					if(!tcs.removeAllowed.get(x))
						continue;
					
					Point dX = tcs.pickup2Delivery.get(x);
					if(dX == null){
						continue;
					}
					
					double cost = tcs.objective.evaluateRemoveTwoPoints(x, dX);
					if(cost > maxCost){
						maxCost = cost;
						removedPickup = x;
						removedDelivery = dX;
					}
				}
			}
			
			if(removedDelivery == null || removedPickup == null)
				break;
			int ridx = tcs.XR.route(removedPickup);
			tcs.rejectPickupPoints.add(removedPickup);
			tcs.rejectDeliveryPoints.add(removedDelivery);
			
			tcs.nChosed.put(removedDelivery, tcs.nChosed.get(removedDelivery)+1);
			tcs.nChosed.put(removedPickup, tcs.nChosed.get(removedPickup)+1);
			
			tcs.group2marked.put(tcs.point2Group.get(removedPickup), 0);
			tcs.group2marked.put(tcs.point2Group.get(removedDelivery), 0);	
			tcs.mgr.performRemoveTwoPoints(removedPickup, removedDelivery);
			if(tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(ridx)) <= 1){
				int groupTruck = tcs.point2Group.get(tcs.XR.getStartingPointOfRoute(ridx));
				tcs.group2marked.put(groupTruck, 0);
			}
		}
	}
	
	public void forbidden_removal(int nRemoval){
		
		//System.out.println("forbidden_removal");
		
		for(int i=0; i < tcs.pickupPoints.size(); i++){
			Point pi = tcs.pickupPoints.get(i);
			Point pj = tcs.pickup2Delivery.get(pi);
			
			if(tcs.nChosed.get(pi) > tcs.nTabu){
				tcs.removeAllowed.put(pi, false);
				tcs.removeAllowed.put(pj, false);
			}
		}
		
		switch(nRemoval){
			case 0: routeRemoval(); break;
			case 1: randomRequestRemoval(); break;
			case 2: shaw_removal(); break;
			case 3: worst_removal(); break;
		}
		
		for(int i=0; i < tcs.pickupPoints.size(); i++){
			Point pi = tcs.pickupPoints.get(i);
			tcs.removeAllowed.put(pi, true);
			Point pj = tcs.pickup2Delivery.get(pi);
			tcs.removeAllowed.put(pj, true);
		}
	}
	
	public void greedy_randomized_contruction_req_shuffle(){
		System.out.println("greedyInsertion random contructive and shuffle points");
		
		int nPoints = tcs.rejectPickupPoints.size();
		int nbRoutes = tcs.XR.getNbRoutes();
		List<Point> consideredPoint = new ArrayList<Point>(tcs.rejectPickupPoints);
		Collections.shuffle(consideredPoint);
		
		for(int i = 0; i < nPoints; i++){
			Point pickup = consideredPoint.get(i);
			int groupId = tcs.point2Group.get(pickup);
			if(tcs.group2marked.get(groupId) == 1 
				|| tcs.XR.route(pickup) != Constants.NULL_POINT){
				continue;
			}
			else{
				Point delivery = tcs.pickup2Delivery.get(pickup);
				ArrayList<Integer> truck_cand = new ArrayList<Integer>();
				ArrayList<Point> pre_pick_cand = new ArrayList<Point>();
				ArrayList<Point> pre_del_cand = new ArrayList<Point>();
				ArrayList<Double> obj_cand = new ArrayList<Double>();
				ArrayList<Integer> rank_cand = new ArrayList<Integer>();
				for(int r = 1; r <= nbRoutes; r++){
					Point st = tcs.XR.getStartingPointOfRoute(r);
					for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
						for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
							if(tcs.S.evaluateAddTwoPoints(pickup, p, delivery, q) == 0){
								double cost = tcs.objective.evaluateAddTwoPoints(pickup, p, delivery, q);
								truck_cand.add(r);
								pre_pick_cand.add(p);
								pre_del_cand.add(q);
								obj_cand.add(cost);
								if(pickup.getLocationCode() == p.getLocationCode()
									&& delivery.getLocationCode() == p.getLocationCode())
									rank_cand.add(1);
								else if((pickup.getLocationCode() == p.getLocationCode()
									&& delivery.getLocationCode() != p.getLocationCode())
									|| (pickup.getLocationCode() != p.getLocationCode()
									&& delivery.getLocationCode() == p.getLocationCode()))
									rank_cand.add(2);
								else
									rank_cand.add(3);
							}
						}
					}
				}
				if(truck_cand.size() > 0){
					double max_cost = -1;
					double min_cost = Integer.MAX_VALUE;
					for(int t = 0; t < obj_cand.size(); t++){
						double cost = obj_cand.get(t);
						if(cost < min_cost)
							min_cost = cost;
						if(cost > max_cost)
							max_cost = cost;
					}
					//get rcl
					ArrayList<Integer> index_rcl = new ArrayList<Integer>();
					for(int t = 0; t < obj_cand.size(); t++){
						double cost = obj_cand.get(t);
						if(cost <= (min_cost + tcs.alpha*(max_cost - min_cost))){
							tcs.mgr.performAddTwoPoints(pickup, pre_pick_cand.get(t),
									delivery, pre_del_cand.get(t));
							tcs.insertMoocToRoutes(truck_cand.get(t));
							if(tcs.S.violations() == 0)
								index_rcl.add(t);
							tcs.mgr.performRemoveTwoPoints(pickup, delivery);
							tcs.removeMoocOnRoutes(truck_cand.get(t));
						}
					}
					ArrayList<Double> prob = tcs.computeProb(index_rcl, rank_cand);
					DistributedRandomNumberGenerator g = new DistributedRandomNumberGenerator(index_rcl, prob);
					int rand = g.getDistributedRandomNumber();
					tcs.mgr.performAddTwoPoints(pickup, pre_pick_cand.get(rand),
							delivery, pre_del_cand.get(rand));
					int groupTruck = tcs.point2Group.get(tcs.XR.getStartingPointOfRoute(truck_cand.get(rand)));
					tcs.group2marked.put(groupTruck, 1);
					tcs.group2marked.put(groupId, 1);
					
					tcs.rejectPickupPoints.remove(pickup);
					tcs.rejectDeliveryPoints.remove(delivery);
				}
			}
		}
		
		tcs.insertMoocForAllRoutes();
		
//		System.out.println("greedy insertion random contructive");
//		int nbRoutes = tcs.XR.getNbRoutes();
//
//		List<Integer> routeIdx = new ArrayList<Integer>();
//		for(int r = 1; r <= nbRoutes; r++)
//			routeIdx.add(r);
//		Collections.shuffle(routeIdx);
//		
//		for(int r : routeIdx){
//			HashMap<Point, Boolean> point2valid = new HashMap<Point, Boolean>();
//			while(true){
//				ArrayList<Point> pick_cand = new ArrayList<Point>();
//				ArrayList<Point> del_cand = new ArrayList<Point>();
//				ArrayList<Point> pre_pick_cand = new ArrayList<Point>();
//				ArrayList<Point> pre_del_cand = new ArrayList<Point>();
//				ArrayList<Double> obj_cand = new ArrayList<Double>();
//				ArrayList<Integer> group_cand = new ArrayList<Integer>();
//				ArrayList<Integer> rank_cand = new ArrayList<Integer>();
//				
//				Point st = tcs.XR.getStartingPointOfRoute(r);
//				int nPoints = tcs.rejectPickupPoints.size();
//				for(int i = 0; i < nPoints; i++){
//					Point pickup = tcs.rejectPickupPoints.get(i);
//					int groupId = tcs.point2Group.get(pickup);
//					if(tcs.group2marked.get(groupId) == 1 
//						|| tcs.XR.route(pickup) != Constants.NULL_POINT
//						|| (point2valid.get(pickup) != null && point2valid.get(pickup) == true)){
//						continue;
//					}
//					else{
//						//System.out.println("r = " + r + ", " + i + "/" + nPoints + ", nbR = " + nbR);
//						Point delivery = tcs.pickup2Delivery.get(pickup);
//						boolean mark = false;
//						for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
//							if(mark)
//								break;
//							for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
////								mgr.performAddTwoPoints(pickup, p, delivery, q);
////								insertMoocToRoutes(r);
//
//								if(tcs.S.evaluateAddTwoPoints(pickup, p, delivery, q) == 0){
//									double cost = tcs.objective.evaluateAddTwoPoints(pickup, p, delivery, q);
//									pick_cand.add(pickup);
//									del_cand.add(delivery);
//									pre_pick_cand.add(p);
//									pre_del_cand.add(q);
//									obj_cand.add(cost);
//									group_cand.add(groupId);
//									if(pickup.getLocationCode() == p.getLocationCode()
//										&& delivery.getLocationCode() == p.getLocationCode())
//										rank_cand.add(1);
//									else if((pickup.getLocationCode() == p.getLocationCode()
//										&& delivery.getLocationCode() != p.getLocationCode())
//										|| (pickup.getLocationCode() != p.getLocationCode()
//										&& delivery.getLocationCode() == p.getLocationCode()))
//										rank_cand.add(2);
//									else
//										rank_cand.add(3);
//									mark = true;
//								}
////								mgr.performRemoveTwoPoints(pickup, delivery);
////								removeMoocOnRoutes(r);
//								if(mark)
//									break;
//							}
//						}
//						if(!mark)
//							point2valid.put(pickup, true);
//					}
//				}
//				
//				if(pick_cand.size() > 0){
//					double max_cost = -1;
//					double min_cost = Integer.MAX_VALUE;
//					for(int i = 0; i < obj_cand.size(); i++){
//						double cost = obj_cand.get(i);
//						if(cost < min_cost)
//							min_cost = cost;
//						if(cost > max_cost)
//							max_cost = cost;
//					}
//					//get rcl
//					ArrayList<Integer> index_rcl = new ArrayList<Integer>();
//					for(int i = 0; i < obj_cand.size(); i++){
//						double cost = obj_cand.get(i);
//						if(cost <= (min_cost + 0.3*(max_cost - min_cost))){
//							tcs.mgr.performAddTwoPoints(pick_cand.get(i), pre_pick_cand.get(i),
//									del_cand.get(i), pre_del_cand.get(i));
//							tcs.insertMoocToRoutes(r);
//							if(tcs.S.violations() == 0)
//								index_rcl.add(i);
//							tcs.mgr.performRemoveTwoPoints(pick_cand.get(i), del_cand.get(i));
//							tcs.removeMoocOnRoutes(r);
//						}
//					}
//					ArrayList<Double> prob = tcs.computeProb(index_rcl, rank_cand);
//					DistributedRandomNumberGenerator g = new DistributedRandomNumberGenerator(index_rcl, prob);
//					int rand = g.getDistributedRandomNumber();
//					tcs.mgr.performAddTwoPoints(pick_cand.get(rand), pre_pick_cand.get(rand),
//							del_cand.get(rand), pre_del_cand.get(rand));
//					int groupTruck = tcs.point2Group.get(st);
//					tcs.group2marked.put(groupTruck, 1);
//					tcs.group2marked.put(group_cand.get(rand), 1);
//
//					tcs.rejectPickupPoints.remove(pick_cand.get(rand));
//					tcs.rejectDeliveryPoints.remove(del_cand.get(rand));
//				}
//				else
//					break;
//			}
//		}
//
//		tcs.insertMoocForAllRoutes();
		
		
//		System.out.println("greedyInsertion");
//		int c = 0;
//		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
//			Point pickup = tcs.rejectPickupPoints.get(i);
//			int groupId = tcs.point2Group.get(pickup);
//			
//			if(tcs.XR.route(pickup) != Constants.NULL_POINT
//				|| tcs.group2marked.get(groupId) == 1)
//				continue;
//			//System.out.println(c++);
//			Point delivery = tcs.pickup2Delivery.get(pickup);
//			//add the request to route
//			Point pre_pick = null;
//			Point pre_delivery = null;
//			double best_objective = Double.MAX_VALUE;
//			for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
//				Point st = tcs.XR.getStartingPointOfRoute(r);
//				
//				int groupTruck = tcs.point2Group.get(st);
//				if(tcs.group2marked.get(groupTruck) == 1 
//						&& tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) <= 1)
//					continue;
//				for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
//					for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
////						if((tcs.XR.prev(p)!= null && tcs.XR.prev(p).getID() % 2 == 1
////								&& p.getID() % 2 == 1
////								&& pickup.getID() % 2 == 1)
////								|| (tcs.XR.next(p) != null && tcs.XR.next(p).getID() % 2 == 1
////								&& p.getID() % 2 == 1
////								&& pickup.getID() % 2 == 1))
////								System.out.println("bug");
//						tcs.mgr.performAddTwoPoints(pickup, p, delivery, q);
//						tcs.insertMoocToRoutes(r);
//						if(tcs.S.violations() == 0){
//							double cost = tcs.objective.getValue();
//							if( cost < best_objective){
//								best_objective = cost;
//								pre_pick = p;
//								pre_delivery = q;
//							}
//						}
//						tcs.mgr.performRemoveTwoPoints(pickup, delivery);
//						tcs.removeMoocOnRoutes(r);
//					}
//				}
//			}
//			if(pre_pick != null && pre_delivery != null){
//				tcs.mgr.performAddTwoPoints(pickup, pre_pick, delivery, pre_delivery);
//				Point st = tcs.XR.getStartingPointOfRoute(tcs.XR.route(pre_pick));
//				tcs.rejectPickupPoints.remove(pickup);
//				tcs.rejectDeliveryPoints.remove(delivery);
//				int groupTruck = tcs.point2Group.get(st);
//				tcs.group2marked.put(groupTruck, 1);
//				tcs.group2marked.put(groupId, 1);
//				i--;
//			}
//		}
//		tcs.insertMoocForAllRoutes();
	}
	
	public void greedyInsertion(){		
		System.out.println("greedyInsertion");

		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
			Point pickup = tcs.rejectPickupPoints.get(i);
			int groupId = tcs.point2Group.get(pickup);
			
			if(tcs.XR.route(pickup) != Constants.NULL_POINT
				|| tcs.group2marked.get(groupId) == 1)
				continue;
			//System.out.println(c++);
			Point delivery = tcs.pickup2Delivery.get(pickup);
			//add the request to route
			Point pre_pick = null;
			Point pre_delivery = null;
			double best_objective = Double.MAX_VALUE;
			
			ArrayList<Point> pre_pick_cand = new ArrayList<Point>();
			ArrayList<Point> pre_del_cand = new ArrayList<Point>();
			
			for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
				Point st = tcs.XR.getStartingPointOfRoute(r);
				int groupTruck = tcs.point2Group.get(st);
				if(tcs.group2marked.get(groupTruck) == 1 
						&& tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) <= 1)
					continue;
				for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
					for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
						if(tcs.S.evaluateAddTwoPoints(pickup, p, delivery, q) == 0){
							pre_pick_cand.add(p);
							pre_del_cand.add(q);
						}
					}
				}
			}
			if(pre_pick_cand.size() > 0){
				for(int t = 0; t < pre_pick_cand.size();t++){
					int route = tcs.XR.route(pre_pick_cand.get(t));
					tcs.mgr.performAddTwoPoints(pickup, pre_pick_cand.get(t),
							delivery, pre_del_cand.get(t));
					tcs.insertMoocToRoutes(route);
					if(tcs.S.violations() == 0){
						double cost = tcs.objective.getValue();
						if(cost < best_objective){
							pre_pick = pre_pick_cand.get(t);
							pre_delivery = pre_del_cand.get(t);
						}
					}
					tcs.mgr.performRemoveTwoPoints(pickup, delivery);
					tcs.removeMoocOnRoutes(route);
				}
				if(pre_pick != null){
					tcs.mgr.performAddTwoPoints(pickup, pre_pick, delivery, pre_delivery);
					Point st = tcs.XR.getStartingPointOfRoute(tcs.XR.route(pre_pick));
					tcs.rejectPickupPoints.remove(pickup);
					tcs.rejectDeliveryPoints.remove(delivery);
					int groupTruck = tcs.point2Group.get(st);
					tcs.group2marked.put(groupTruck, 1);
					tcs.group2marked.put(groupId, 1);
					i--;
				}
			}
		}
		tcs.insertMoocForAllRoutes();
	}
	
	public void greedyInsertionWithNoise(){
		//System.out.println("greedyInsertionWithNoise");
//		HashMap<Truck, Integer> truck2marked = new HashMap<Truck, Integer>();
//		Truck[] trucks = tcs.input.getTrucks();
//		for(int i = 0; i < trucks.length; i++)
//			truck2marked.put(trucks[i], 0);
//		for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
//			if(tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) > 1){
//				Point st = tcs.XR.getStartingPointOfRoute(r);
//				Truck truck = tcs.startPoint2Truck.get(st);
//				truck2marked.put(truck, 1);
//			}
//		}
		
		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
			Point pickup = tcs.rejectPickupPoints.get(i);
			int groupId = tcs.point2Group.get(pickup);
			
			if(tcs.XR.route(pickup) != Constants.NULL_POINT
				|| tcs.group2marked.get(groupId) == 1)
				continue;
			Point delivery = tcs.pickup2Delivery.get(pickup);
			//add the request to route
			Point pre_pick = null;
			Point pre_delivery = null;
			double best_objective = Double.MAX_VALUE;
			for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
				Point st = tcs.XR.getStartingPointOfRoute(r);

				int groupTruck = tcs.point2Group.get(st);

				if(tcs.group2marked.get(groupTruck) == 1 && tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) <= 1)
					continue;
				
				for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
					for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
//						if((tcs.XR.prev(p)!= null && tcs.XR.prev(p).getID() % 2 == 1
//								&& p.getID() % 2 == 1
//								&& pickup.getID() % 2 == 1)
//								|| (tcs.XR.next(p) != null && tcs.XR.next(p).getID() % 2 == 1
//								&& p.getID() % 2 == 1
//								&& pickup.getID() % 2 == 1))
//								System.out.println("bug");
						tcs.mgr.performAddTwoPoints(pickup, p, delivery, q);
						tcs.insertMoocToRoutes(r);
						
						if(tcs.S.violations() == 0){
							double cost = tcs.objective.getValue();
							double ran = Math.random()*2-1;
							cost += GRASPsolver.MAX_TRAVELTIME*0.1*ran;
							if( cost < best_objective){
								best_objective = cost;
								pre_pick = p;
								pre_delivery = q;
							}
						}
						tcs.mgr.performRemoveTwoPoints(pickup, delivery);
						tcs.removeMoocOnRoutes(r);
					}
				}
			}
			if(pre_pick != null && pre_delivery != null){
				tcs.mgr.performAddTwoPoints(pickup, pre_pick, delivery, pre_delivery);
				Point st = tcs.XR.getStartingPointOfRoute(tcs.XR.route(pre_pick));
				int groupTruck = tcs.point2Group.get(st);
				tcs.group2marked.put(groupTruck, 1);
				tcs.rejectPickupPoints.remove(pickup);
				tcs.rejectDeliveryPoints.remove(delivery);
				tcs.group2marked.put(groupId, 1);
				i--;
			}
		}
		tcs.insertMoocForAllRoutes();
	}
	
	public void regret_n_insertion(int n){
		System.out.println("regret insertion n = " + n);
		
		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
			Point pickup = tcs.rejectPickupPoints.get(i);
			int groupId = tcs.point2Group.get(pickup);
			
			if(tcs.XR.route(pickup) != Constants.NULL_POINT
				|| tcs.group2marked.get(groupId) == 1)
				continue;
			Point delivery = tcs.pickup2Delivery.get(pickup);
			//add the request to route
			Point pre_pick = null;
			Point pre_delivery = null;
			double n_best_objective[] = new double[n];
			double best_regret_value = Double.MIN_VALUE;
			
			for(int it=0; it<n; it++){
				n_best_objective[it] = Double.MAX_VALUE;
			}
			
			ArrayList<Point> pre_pick_cand = new ArrayList<Point>();
			ArrayList<Point> pre_del_cand = new ArrayList<Point>();
			
			for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
				Point st = tcs.XR.getStartingPointOfRoute(r);
				int groupTruck = tcs.point2Group.get(st);

				if(tcs.group2marked.get(groupTruck) == 1 && tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) <= 1)
					continue;
				
				for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
					for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
						if(tcs.S.evaluateAddTwoPoints(pickup, p, delivery, q) == 0){
							pre_pick_cand.add(p);
							pre_del_cand.add(q);
						}
					}
				}
			}
			if(pre_pick_cand.size() > 0){
				for(int t = 0; t < pre_pick_cand.size();t++){
					int route = tcs.XR.route(pre_pick_cand.get(t));
					tcs.mgr.performAddTwoPoints(pickup, pre_pick_cand.get(t),
							delivery, pre_del_cand.get(t));
					tcs.insertMoocToRoutes(route);
					if(tcs.S.violations() == 0){
						double cost = tcs.objective.getValue();
						for(int it=0; it<n; it++){
							if(n_best_objective[it] > cost){
								for(int it2 = n-1; it2 > it; it2--){
									n_best_objective[it2] = n_best_objective[it2-1];
								}
								n_best_objective[it] = cost;
								break;
							}
						}
						double regret_value = 0;
						for(int it=1; it<n; it++){
							regret_value += Math.abs(n_best_objective[it] - n_best_objective[0]);
						}
						if(regret_value > best_regret_value){
							best_regret_value = regret_value;
							pre_pick = pre_pick_cand.get(t);
							pre_delivery = pre_del_cand.get(t);
						}
					}
					tcs.mgr.performRemoveTwoPoints(pickup, delivery);
					tcs.removeMoocOnRoutes(route);
				}
				if(pre_pick != null){
					tcs.mgr.performAddTwoPoints(pickup, pre_pick, delivery, pre_delivery);
					Point st = tcs.XR.getStartingPointOfRoute(tcs.XR.route(pre_pick));
					int groupTruck = tcs.point2Group.get(st);
					tcs.group2marked.put(groupTruck, 1);
					tcs.rejectPickupPoints.remove(pickup);
					tcs.rejectDeliveryPoints.remove(delivery);
					tcs.group2marked.put(groupId, 1);
					i--;
				}
			}
		}
		tcs.insertMoocForAllRoutes();
	}
	
	public void first_possible_insertion(){
		System.out.println("first_possible_insertion");
		
		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
			Point pickup = tcs.rejectPickupPoints.get(i);
			int groupId = tcs.point2Group.get(pickup);
			
			if(tcs.XR.route(pickup) != Constants.NULL_POINT
				|| tcs.group2marked.get(groupId) == 1)
				continue;
			Point delivery = tcs.pickup2Delivery.get(pickup);
			//add the request to route
			Point pre_pick = null;
			Point pre_delivery = null;
			double best_objective = Double.MAX_VALUE;
			boolean finded = false;
			for(int r = 1; r <= tcs.XR.getNbRoutes(); r++){
				if(finded)
					break;
				Point st = tcs.XR.getStartingPointOfRoute(r);
				int groupTruck = tcs.point2Group.get(st);
				if(tcs.group2marked.get(groupTruck) == 1 && tcs.XR.index(tcs.XR.getTerminatingPointOfRoute(r)) <= 1)
					continue;
				
				for(Point p = st; p != tcs.XR.getTerminatingPointOfRoute(r); p = tcs.XR.next(p)){
					if(finded)
						break;
					for(Point q = p; q != tcs.XR.getTerminatingPointOfRoute(r); q = tcs.XR.next(q)){
						tcs.mgr.performAddTwoPoints(pickup, p, delivery, q);
						tcs.insertMoocToRoutes(r);
						if(tcs.S.violations() == 0){
							double cost = tcs.objective.getValue();
							if( cost < best_objective){
								tcs.removeMoocOnRoutes(r);
								tcs.group2marked.put(groupTruck, 1);
								tcs.rejectPickupPoints.remove(pickup);
								tcs.rejectDeliveryPoints.remove(delivery);
								tcs.group2marked.put(groupId, 1);
								finded = true;
								i--;
								break;
							}
						}
						tcs.mgr.performRemoveTwoPoints(pickup, delivery);
						tcs.removeMoocOnRoutes(r);
					}
				}
			}
		}
		tcs.insertMoocForAllRoutes();
	}
	
	public void sort_before_insertion(int iInsertion){
		//System.out.println("sort_before_insertion");
		
		sort_reject_people();
		
		switch(iInsertion){
			case 0: greedyInsertion(); break;
			case 1: first_possible_insertion(); break;
			case 2: regret_n_insertion(2); break;
			case 3: greedy_randomized_contruction_req_shuffle(); break;
		}
		
		Collections.shuffle(tcs.rejectPickupPoints);
	}
	
	private void sort_reject_people(){
		HashMap<Point, Integer> time_flexibility = new HashMap<Point, Integer>();
		
		for(int i = 0; i < tcs.rejectPickupPoints.size(); i++){
			Point pickup = tcs.rejectPickupPoints.get(i);
			Point delivery = tcs.pickup2Delivery.get(pickup);
			
			int lp = tcs.lastestAllowedArrivalTime.get(pickup);
			int ud = tcs.earliestAllowedArrivalTime.get(delivery);
			
			time_flexibility.put(pickup, ud-lp);
		}
		
		List<Point> keys = new ArrayList<Point>(time_flexibility.keySet());
		List<Integer> values = new ArrayList<Integer>(time_flexibility.values());
		Collections.sort(values);
		
		ArrayList<Point> rejectPointSorted = new ArrayList<Point>();
		for(int i = 0; i < values.size(); i++){
			int v = values.get(i);
			for(int j = 0; j < keys.size(); j++){
				Point p = keys.get(j);
				int vs = time_flexibility.get(p);
				if(vs == v){
					rejectPointSorted.add(p);
					keys.remove(p);
					break;
				}
			}
		}
		tcs.rejectPickupPoints = rejectPointSorted;
	}
}
