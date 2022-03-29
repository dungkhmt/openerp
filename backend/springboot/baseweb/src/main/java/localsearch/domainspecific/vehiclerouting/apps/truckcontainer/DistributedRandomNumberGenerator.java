package localsearch.domainspecific.vehiclerouting.apps.truckcontainer;

import java.util.ArrayList;

public class DistributedRandomNumberGenerator {
	private ArrayList<Double> distribution;
	private ArrayList<Integer> elements;
    private double distSum;

    public DistributedRandomNumberGenerator(ArrayList<Integer> elements, ArrayList<Double> distribution) {
        this.distribution = distribution;
        this.elements = elements;
        for(int i = 0; i < distribution.size(); i++)
        	distSum += distribution.get(i);
    }

    public int getDistributedRandomNumber() {
        double rand = Math.random();
        double ratio = 1.0f / distSum;
        double tempDist = 0;
        for (int i = 0; i < distribution.size(); i++){
            tempDist += distribution.get(i);
            if (rand / ratio <= tempDist) {
                return elements.get(i);
            }
        }
        return 0;
    }
}
