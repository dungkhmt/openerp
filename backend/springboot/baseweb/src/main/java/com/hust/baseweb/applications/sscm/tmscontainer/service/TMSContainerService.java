package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.google.gson.Gson;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.TruckContainerSolver;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.TruckMoocContainerOutputJson;

import java.io.BufferedWriter;
import java.io.FileWriter;

public class TMSContainerService {
    public TruckMoocContainerOutputJson solve(String inputJson){
        TruckContainerSolver solver  = new TruckContainerSolver();

        solver.input(inputJson);
        solver.init();
        solver.stateModel();

        solver.firstPossibleInitFPIUS();



        solver.nRemovalOperators = 8;
        solver.nInsertionOperators = 8;

        solver.lower_removal = (int) (0.1*TruckContainerSolver.nRequest);
        solver.upper_removal = (int) (0.25*TruckContainerSolver.nRequest);
        solver.sigma1 = 10;
        solver.sigma2 = -1;
        solver.sigma3 = -3;
        solver.rp = 0.1;
        solver.nw = 1;
        solver.shaw1st = 0.5;
        solver.shaw2nd = 0.2;
        solver.	shaw3rd = 0.1;
        solver.temperature = 200;
        solver.cooling_rate = 0.9995;
        solver.nTabu = 5;

        solver.initParamsForALNS();
        solver.adaptiveSearchOperators("tmscontainer-log.txt");
        solver.printSolution("tmscontainer-log.txt");

        Gson g = new Gson();
        TruckMoocContainerOutputJson solution = solver.createFormatedSolution();
        try{
            String out = g.toJson(solution);
            BufferedWriter writer = new BufferedWriter(new FileWriter("tmscontainer-output.txt"));
            writer.write(out);

            writer.close();
        }catch(Exception e){
            System.out.println(e);
        }

        return solution;
    }
}
