package localsearch.domainspecific.vehiclerouting.apps.vinamilk.service;

import java.util.HashMap;

import localsearch.domainspecific.vehiclerouting.apps.vinamilk.model.Utils;
import localsearch.domainspecific.vehiclerouting.vrp.VRManager;
import localsearch.domainspecific.vehiclerouting.vrp.VarRoutesVR;
import localsearch.domainspecific.vehiclerouting.vrp.entities.Point;

public class BranchAndBoundForTSP {
	int r;
	int n;// so luong dinh

	boolean[] b;// mang danh dau

	int[] kq;
	int[] bestConfig;// mang tam, va mang luu cau hinh tot nhat

	double boundCost;
	double cost = 0;// gia tri thap nhat khi di qua cac dinh va gia tri tam

	int start;// dinh bat dau
	
	MDMTPSolver s;
	HashMap<Integer, Point> id2point;
	public BranchAndBoundForTSP(MDMTPSolver s) {
		this.s = s;
	}
	
	public void sortCustomerOnRoute(int r) {
		this.r = r;
		Point en = s.XR.getTerminatingPointOfRoute(r);
		n = s.XR.index(en);
		if(n<=2)
			return;
		
		id2point = new HashMap<Integer, Point>();
		b = new boolean[n];
		kq = new int[n];
		bestConfig = new int[n];
		boundCost = 0;
		
		Point st = s.XR.getStartingPointOfRoute(r);
		int i = 0;
		Point p;
		for(p = st; p != en; p = s.XR.next(p)) {
			boundCost += s.matrixT[p.getID()][s.XR.next(p).getID()];
			if(p.getTypeOfPoint().equals(Utils.CUSTOMER)|| p == st) {
				id2point.put(i, p);
				b[i] = false;
				bestConfig[i] = i;
				i++;
			}
		}
		boundCost += s.matrixT[p.getID()][en.getID()];
		
		b[0] = true;
		kq[0] = 0;
		Try(1);
		updateRoute(r);
	}
	
	public void Try(int i){
		if(i==n){
			double d = s.matrixT[id2point.get(kq[i-1]).getID()][id2point.get(kq[0]).getID()];
			if(cost + d < boundCost){
				boundCost = cost + d;
				for(int k = 0; k < n; k++)
					bestConfig[k] = kq[k];
			}
		}
		else{
			for(int j = 0; j < n; j++){
				// neu chua di qua va gia tri con cho phep
				double d = s.matrixT[id2point.get(kq[i-1]).getID()][id2point.get(kq[j]).getID()];
				if(b[j]==false && cost + d < boundCost){
					//ghi nho lai ket qua
					kq[i]=j;
					b[j]=true;
					
					cost += d;
					//goi de qui den buoc tiep theo
					Try(i+1);
					//xoa bo ghi nho
					b[j]=false;
					cost -= d;
				}
			}
		}
	}
	
	public void updateRoute(int r) {
		Point st = s.XR.getStartingPointOfRoute(r);
		Point en = s.XR.getTerminatingPointOfRoute(r);
		while(true) {
			Point p = s.XR.next(st);
			if(p == en)
				break;
			s.mgr.performRemoveOnePoint(p);
		}
		Point p = st;
		for(int i = 1; i < n; i++) {
			Point c = id2point.get(bestConfig[i]);
			s.mgr.performAddOnePoint(c, p);
			p = c;
		}
	}
}
