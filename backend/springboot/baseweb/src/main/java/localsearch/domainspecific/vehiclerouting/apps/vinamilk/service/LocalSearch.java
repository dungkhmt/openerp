package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Utils;
import localsearch.domainspecific.vehiclerouting.vrp.Constants;
import localsearch.domainspecific.vehiclerouting.vrp.VRManager;
import localsearch.domainspecific.vehiclerouting.vrp.VarRoutesVR;
import localsearch.domainspecific.vehiclerouting.vrp.entities.Point;

public class LocalSearch {
	MDMTPSolver solver;
	ArrayList<Point> usedPoints;
	Random rand;
	
	public LocalSearch(MDMTPSolver solver) {
		super();
		this.solver = solver;
		usedPoints = getAssignedPoints();
		rand = new Random();
	}
	
	private ArrayList<Point> getAssignedPoints(){
		ArrayList<Point> result = new ArrayList<Point>();
		for(Point p : solver.customerPoints)
			if(solver.XR.route(p) != Constants.NULL_POINT)
				result.add(p);
		return result;
	}
	
	public ArrayList<String> onePointMove(int cur_nbServedPoint, int cur_nbUsedVehicles, double cur_cost) {
		System.out.println("onepointmove");
		int idx = rand.nextInt(usedPoints.size()-1);
		int idy = rand.nextInt(usedPoints.size()-1);
		int rx = solver.XR.route(usedPoints.get(idx));
		String vhCodeX = solver.startPoint2vhCode.get(solver.XR.getStartingPointOfRoute(rx));
		
		boolean isBreak = true;
		int i = 0;
		Point x = usedPoints.get(idx);
		Point y = usedPoints.get(idy);
		
		while(isBreak) {
			y = usedPoints.get(idy);
			if(solver.ctrs.customerCanVisitedByVehicle(vhCodeX, y.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX, y.getTypeOfProduct()) == false
				|| solver.ctrs.customerCanVisitedByVehicle(vhCodeX, y.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX, y.getTypeOfProduct()) == false
				|| y.getID() == x.getID()
				|| (solver.XR.next(y).getTypeOfPoint().equals(Utils.CUSTOMER) && x.getID() == solver.XR.next(y).getID())
				|| (solver.XR.next(y).getTypeOfPoint().equals(Utils.DEPOT) && x.getID() == solver.XR.next(solver.XR.next(y)).getID())) {
				idy = rand.nextInt(usedPoints.size()-1);
				if(i++ > 500) {
					y = null;
					break;
				}
				continue;
			}
			else 
				break;
		}
		if(y != null) {
			int ry = solver.XR.route(y);
			solver.removeDepotPointFromRoute(rx);
			solver.removeDepotPointFromRoute(ry);
			solver.mgr.performOnePointMove(x, y);
			
			solver.addDepotToOneRoute(rx);
			solver.addDepotToOneRoute(ry);
			if(solver.ctrs.timeWindowConstraint(rx)
				&& solver.ctrs.timeWindowConstraint(ry)
				&& solver.ctrs.upperCapacityConstraints(rx)
				&& solver.ctrs.upperCapacityConstraints(ry)) {
				int new_usedVehicles = solver.getNbUsedVehicles();
				double new_cost = solver.objective.getValue();
				if(new_usedVehicles < cur_nbUsedVehicles
					|| (new_usedVehicles == cur_nbUsedVehicles && new_cost < cur_cost))
					solver.onePointMoveList.clear();
					solver.onePointMoveList.add(x);
					solver.onePointMoveList.add(y);
					ArrayList<String> rs = new ArrayList<String>();
					rs.add(cur_nbServedPoint +"");
					rs.add(new_usedVehicles +"");
					rs.add(new_cost+"");
					
					return rs;
			}
			else {
				return null;
			}
		}
		return null;
	}
	
	public ArrayList<String> twoPointMove(int cur_nbServedPoint, int cur_nbUsedVehicles, double cur_cost) {
		System.out.println("twopointmove");
		int idx = rand.nextInt(usedPoints.size()-1);
		Point x = usedPoints.get(idx);
		int rx = solver.XR.route(usedPoints.get(idx));
		Point st = solver.XR.getStartingPointOfRoute(rx);

		ArrayList<Point> onRoutePoint = new ArrayList<Point>();
		for(Point p = solver.XR.next(st); p != solver.XR.getTerminatingPointOfRoute(rx); p = solver.XR.next(p)) {
			if(p != x && p.getTypeOfPoint().equals(Utils.CUSTOMER))
				onRoutePoint.add(p);
		}
		if(onRoutePoint.size() <= 1)
			return null;
		Point y = onRoutePoint.get(rand.nextInt(onRoutePoint.size()-1));
		int ry = solver.XR.route(y);
		if(y != null) {
			solver.removeDepotPointFromRoute(rx);
			solver.removeDepotPointFromRoute(ry);
			solver.mgr.performTwoPointsMove(x, y);
			solver.addDepotToOneRoute(rx);
			solver.addDepotToOneRoute(ry);
			if(solver.ctrs.timeWindowConstraint(rx)
				&& solver.ctrs.upperCapacityConstraints(rx)
				&& solver.ctrs.timeWindowConstraint(ry)
				&& solver.ctrs.upperCapacityConstraints(ry)) {
				int new_usedVehicles = solver.getNbUsedVehicles();
				double new_cost = solver.objective.getValue();
				if(new_usedVehicles < cur_nbUsedVehicles
					|| (new_usedVehicles == cur_nbUsedVehicles && new_cost < cur_cost))
					solver.twoPointMoveList.clear();
					solver.twoPointMoveList.add(x);
					solver.twoPointMoveList.add(y);
					ArrayList<String> rs = new ArrayList<String>();
					rs.add(cur_nbServedPoint +"");
					rs.add(new_usedVehicles +"");
					rs.add(new_cost+"");
					
					return rs;
			}
			else {
				return null;
			}
		}
		return null;
	}
	
	public ArrayList<String> threePointMove(int cur_nbServedPoint, int cur_nbUsedVehicles, double cur_cost) {
		System.out.println("threepointmove");
		if(usedPoints.size() <= 6)
			return null;
		int idx1 = rand.nextInt(usedPoints.size()-1);
		int idy1 = rand.nextInt(usedPoints.size()-1);
		int r1 = solver.XR.route(usedPoints.get(idx1));
		String vhCodeX1 = solver.startPoint2vhCode.get(solver.XR.getStartingPointOfRoute(r1));
		
		boolean isBreak = true;
		int i = 0;
		Point x1 = usedPoints.get(idx1);
		Point y1 = null;
		
		while(isBreak) {
			y1 = usedPoints.get(idy1);
			if(solver.ctrs.customerCanVisitedByVehicle(vhCodeX1, y1.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX1, y1.getTypeOfProduct()) == false
				|| solver.ctrs.customerCanVisitedByVehicle(vhCodeX1, y1.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX1, y1.getTypeOfProduct()) == false
				|| y1.getID() == x1.getID()) {
				idy1 = rand.nextInt(usedPoints.size()-1);
				if(i++ > 500) {
					y1 = null;
					break;
				}
				continue;
			}
			else
				break;
		}
		if(y1 == null)
			return null;
		
//		System.out.println("use size = " + usedPoints.size());
		if(idx1 > idy1) {
			usedPoints.remove(idx1);
			usedPoints.remove(idy1);
		}
		else {
			usedPoints.remove(idy1);
			usedPoints.remove(idx1);
		}
		
		int idx2 = rand.nextInt(usedPoints.size()-1);
		int idy2 = rand.nextInt(usedPoints.size()-1);
		int r2 = solver.XR.route(usedPoints.get(idx2));
		String vhCodeX2 = solver.startPoint2vhCode.get(solver.XR.getStartingPointOfRoute(r2));
		
		isBreak = true;
		i = 0;
		Point x2 = usedPoints.get(idx2);
		Point y2 = usedPoints.get(idy2);
		
		while(isBreak) {
			y2 = usedPoints.get(idy2);
			if(solver.ctrs.customerCanVisitedByVehicle(vhCodeX2, y2.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX2, y2.getTypeOfProduct()) == false
				|| solver.ctrs.customerCanVisitedByVehicle(vhCodeX2, y2.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX2, y2.getTypeOfProduct()) == false
				|| y2.getID() == x2.getID()) {
				idy2 = rand.nextInt(usedPoints.size()-1);
				if(i++ > 500) {
					y2 = null;
					break;
				}
				continue;
			}
			else
				break;
		}
		
		if(y2 == null) {
			usedPoints.add(x1);
			usedPoints.add(y1);
			return null;
		}
		
		
		if(idx2 > idy2) {
			usedPoints.remove(idx2);
			usedPoints.remove(idy2);
		}
		else {
			usedPoints.remove(idy2);
			usedPoints.remove(idx2);
		}
		
		int idx3 = rand.nextInt(usedPoints.size()-1);
		int idy3 = rand.nextInt(usedPoints.size()-1);
		int r3 = solver.XR.route(usedPoints.get(idx3));
		String vhCodeX3 = solver.startPoint2vhCode.get(solver.XR.getStartingPointOfRoute(r3));
		
		isBreak = true;
		i = 0;
		Point x3 = usedPoints.get(idx3);
		Point y3 = usedPoints.get(idy3);
		
		while(isBreak) {
			y3 = usedPoints.get(idy3);
			if(solver.ctrs.customerCanVisitedByVehicle(vhCodeX3, y3.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX3, y3.getTypeOfProduct()) == false
				|| solver.ctrs.customerCanVisitedByVehicle(vhCodeX3, y3.getLocationId()) == false
				|| solver.ctrs.typeOfProductsCanCarriedByVehicle(vhCodeX3, y3.getTypeOfProduct()) == false
				|| y3.getID() == x3.getID()) {
				idy3 = rand.nextInt(usedPoints.size()-1);
				if(i++ > 500) {
					y3 = null;
					break;
				}
				continue;
			}
			else
				break;
		}
		usedPoints.add(x1);
		usedPoints.add(y1);
		usedPoints.add(x2);
		usedPoints.add(y2);
		
		if(y3 == null)
			return null;
		
		int ry1 = solver.XR.route(y1);
		int ry2 = solver.XR.route(y2);
		int ry3 = solver.XR.route(y3);
		solver.removeDepotPointFromRoute(r1);
		solver.removeDepotPointFromRoute(r2);
		solver.removeDepotPointFromRoute(r3);
		solver.removeDepotPointFromRoute(ry1);
		solver.removeDepotPointFromRoute(ry2);
		solver.removeDepotPointFromRoute(ry3);

		solver.mgr.performThreePointsMove(x1, x2, x3, y1, y2, y3);
		solver.addDepotToOneRoute(r1);
		solver.addDepotToOneRoute(r2);
		solver.addDepotToOneRoute(r3);
		solver.addDepotToOneRoute(ry1);
		solver.addDepotToOneRoute(ry2);
		solver.addDepotToOneRoute(ry3);
		if(solver.ctrs.timeWindowConstraint(r1)
			&& solver.ctrs.upperCapacityConstraints(r1)
			&& solver.ctrs.timeWindowConstraint(r2)
			&& solver.ctrs.upperCapacityConstraints(r2)
			&& solver.ctrs.timeWindowConstraint(r3)
			&& solver.ctrs.upperCapacityConstraints(r3)
			&& solver.ctrs.timeWindowConstraint(ry1)
			&& solver.ctrs.upperCapacityConstraints(ry1)
			&& solver.ctrs.timeWindowConstraint(ry2)
			&& solver.ctrs.upperCapacityConstraints(ry2)
			&& solver.ctrs.timeWindowConstraint(ry3)
			&& solver.ctrs.upperCapacityConstraints(ry3)) {
			int new_usedVehicles = solver.getNbUsedVehicles();
			double new_cost = solver.objective.getValue();
			if(new_usedVehicles < cur_nbUsedVehicles
				|| (new_usedVehicles == cur_nbUsedVehicles && new_cost < cur_cost))
				solver.threePointMoveList.clear();
				solver.threePointMoveList.add(x1);
				solver.threePointMoveList.add(x2);
				solver.threePointMoveList.add(x3);
				solver.threePointMoveList.add(y1);
				solver.threePointMoveList.add(y2);
				solver.threePointMoveList.add(y3);
				ArrayList<String> rs = new ArrayList<String>();
				rs.add(cur_nbServedPoint +"");
				rs.add(new_usedVehicles +"");
				rs.add(new_cost+"");
				
				return rs;
		}
		else {
			return null;
		}
	}
	
}
