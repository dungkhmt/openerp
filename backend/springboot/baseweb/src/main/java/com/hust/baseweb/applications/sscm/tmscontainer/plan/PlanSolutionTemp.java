package com.hust.baseweb.applications.sscm.tmscontainer.plan;

import static java.lang.Math.min;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import org.json.*;


/**
 * MIP example with a variable array.
 */
public class PlanSolutionTemp {
    /*
    public static List<PickupPoint> get_all_candidate(
        int current_shelf, // vị trí ban đầu, mặc định là index = 0, có tọa độ (0,0)
        int number_shelf, // số lượng kệ hàng có chứa sản phẩm cần lấy
        int number_product, // số lượng sản phẩm cần lấy
        long[][] d, // khoảng cách giữa các kệ, bao gồm cả điểm xuất phát
        long[][] q, // ma trận kề
        List<Long> currentListQuantityProduct,
        boolean[] list_visited,
        Map<Integer, Integer> index2variantId,
        Map<Integer, Integer> index2ShelfId
    ) {
        boolean running = true;
        List<PickupPoint> solutionList = new ArrayList<PickupPoint>();
        while (true) {
            List<Integer> listIndexQuantityProduct = new ArrayList<Integer>();
            for (int i = 0; i < currentListQuantityProduct.size(); i++) {
                if (currentListQuantityProduct.get(i) > 0) {
                    listIndexQuantityProduct.add(i);
                }
            }
            float[] list_candidate = new float[number_shelf + 1];
            for (int i = 0; i < number_shelf + 1; ++i) {
                list_candidate[i] = (float) 0.0;
            }
            for (int j = 1; j < number_shelf + 1; j++) {
                int number_violation = 0;
                if (list_visited[j] != true) {
                    for (int i = 0; i < listIndexQuantityProduct.size(); i++) {
                        number_violation += min(
                            q[listIndexQuantityProduct.get(i)][j - 1],
                            currentListQuantityProduct.get(listIndexQuantityProduct.get(i)));
                    }

                    if (number_violation == 0) {
                        list_visited[j] = true;
                    } else {
                        list_candidate[j] = (float) number_violation / (float) (d[current_shelf][j] + 1);
                    }
                }
            }
            float max_candidate = (float) 0.0;

            int index_candidate = -1;
            for (int i = 0; i < number_shelf + 1; i++) {
                if (list_candidate[i] > max_candidate) {
                    index_candidate = i;
                    max_candidate = list_candidate[i];
                }
            }

            if (index_candidate == -1) {
                break;
            }
            current_shelf = index_candidate;
            int run = 0;
            Map<Integer, Long> pickupQuantity = new HashMap<Integer, Long>();
            for (int i = 0; i < number_product; i++) {
                pickupQuantity.put(
                    index2variantId.get(i),
                    min(q[i][current_shelf - 1], currentListQuantityProduct.get(i)));

            }
            for (int i = 0; i < number_product; i++) {
                currentListQuantityProduct.set(
                    i,
                    currentListQuantityProduct.get(i) -
                    min(q[i][current_shelf - 1], currentListQuantityProduct.get(i)));
                if (currentListQuantityProduct.get(i) > 0) {
                    run += 1;
                }

            }

            list_visited[current_shelf] = true;
            solutionList.add(new PickupPoint(index2ShelfId.get(current_shelf - 1), pickupQuantity));
            if (run == 0) {
                break;
            }
        }
        return solutionList;
    }

    public static List<PickupPoint> searchSolution(String input_json) {
        //convert string to array
        JSONObject json = new JSONObject(input_json);

        //get list shelf
        JSONArray listShelf = json.getJSONArray("listShelf"); // notice that `"posts": [...]`

        //get list items need pickup
        JSONArray lineItems = json.getJSONArray("lineItems");
        Map<Integer, Integer> variantId2Index = new HashMap<Integer, Integer>();
        Map<Integer, Integer> index2variantId = new HashMap<Integer, Integer>();

        //listQuantityProduct is quantity of each product which need pick up.
        List<Long> listQuantityProduct = new ArrayList<Long>();

        for (int i = 0; i < lineItems.length(); ++i) {
            JSONObject variantObject = lineItems.getJSONObject(i);
            variantId2Index.put(new Integer(variantObject.getInt("variantId")), new Integer(i));
            index2variantId.put(new Integer(i), new Integer(variantObject.getInt("variantId")));
            listQuantityProduct.add(variantObject.getLong("quantity"));
        }

        Map<Integer, Integer> shelfId2Index = new HashMap<Integer, Integer>();
        Map<Integer, Integer> index2ShelfId = new HashMap<Integer, Integer>();

        JSONArray variants = json.getJSONArray("variants");
        int indexShefl = 0;
        // find shelf contain variant
        // add to map candidate ( index to shelf_id)
        for (int i = 0; i < variants.length(); ++i) {
            JSONObject post_id2 = variants.getJSONObject(i);
            if (variantId2Index.containsKey(post_id2.getInt("variantId"))) {
                if (shelfId2Index.containsKey(post_id2.getInt("shelfId")) == false) {
                    shelfId2Index.put(new Integer(post_id2.getInt("shelfId")), new Integer(indexShefl));
                    index2ShelfId.put(new Integer(indexShefl), new Integer(post_id2.getInt("shelfId")));
                    indexShefl += 1;
                }
            }
        }

        //create quantity matrix of product-shelf
        // init  matrix of product-shelf
        long[][] q = new long[shelfId2Index.size()][shelfId2Index.size()];
        for (int i = 0; i < shelfId2Index.size(); i++) {
            for (int j = 0; j < shelfId2Index.size(); j++) {
                q[i][j] = (long) 0;
            }
        }

        for (int i = 0; i < variants.length(); ++i) {
            JSONObject variantObject = variants.getJSONObject(i);
            if (variantId2Index.containsKey(variantObject.getInt("variantId"))) {
                if (shelfId2Index.containsKey(variantObject.getInt("shelfId"))) {
                    q[variantId2Index.get(variantObject.getInt("variantId"))][shelfId2Index.get(variantObject.getInt(
                        "shelfId"))] = variantObject.getInt("quantity");
                }
            }
        }

        //create distance matrix of product-shelf quantity
        int numShelf = shelfId2Index.size();
        int numProuduct = variantId2Index.size();
        long[][] d = new long[numShelf + 1][numShelf + 1];

        for (int i = 0; i < listShelf.length() + 1; ++i) {
            for (int j = 0; j < listShelf.length() + 1; ++j) {
                if (i == 0 && j != 0) {
                    JSONObject secondSelfObject = listShelf.getJSONObject(j - 1);
                    if (shelfId2Index.containsKey(secondSelfObject.getInt("shelfId"))) {
                        int index1 = shelfId2Index.get(secondSelfObject.getInt("shelfId"));
                        d[0][index1 + 1] = secondSelfObject.getLong("x") + secondSelfObject.getLong("y");
                    } else {
                        continue;
                    }
                }
                if (i != 0 && j == 0) {
                    JSONObject secondSelfObject = listShelf.getJSONObject(i - 1);
                    if (shelfId2Index.containsKey(secondSelfObject.getInt("shelfId"))) {
                        int index1 = shelfId2Index.get(secondSelfObject.getInt("shelfId"));
                        d[index1 + 1][0] = secondSelfObject.getLong("x") + secondSelfObject.getLong("y");
                    } else {
                        continue;
                    }
                }
                if (i == 0 && j == 0) {
                    d[0][j] = (long) 0;
                }
                if (i != 0 && j != 0) {
                    JSONObject fistSelfObject = listShelf.getJSONObject(j - 1);
                    JSONObject secondSelfObject = listShelf.getJSONObject(i - 1);
                    if (shelfId2Index.containsKey(fistSelfObject.getInt("shelfId")) &&
                        shelfId2Index.containsKey(secondSelfObject.getInt("shelfId"))) {
                        int index1 = shelfId2Index.get(fistSelfObject.getInt("shelfId"));
                        int index = shelfId2Index.get(secondSelfObject.getInt("shelfId"));
                        d[index + 1][index1 + 1] = Long.valueOf(Math.abs(fistSelfObject.getLong("x") -
                                                                         secondSelfObject.getLong("x")) +
                                                                (long) Math.abs(fistSelfObject.getLong("y") -
                                                                                secondSelfObject.getLong("y")));
                    } else {
                        continue;
                    }
                }
            }
        }

        boolean[] visited = new boolean[numShelf + 1];
        visited[0] = true;
        for (int i = 1; i < numShelf + 1; i++) {
            visited[i] = false;
        }
        System.out.println(numShelf);
        System.out.println(numProuduct);

        List<PickupPoint> solution = get_all_candidate(
            0,
            numShelf,
            numProuduct,
            d,
            q,
            listQuantityProduct,
            visited,
            index2variantId,
            index2ShelfId);
        return solution;
    }

//    public static void main(String[] args) throws IOException {
//        final Path filePath = Path.of("/home/vutrian/Desktop/data.json");
//
//        String string = Files.readString(filePath);
//        List<PickupPoint> a = searchSolution(string);
//        System.out.println(a);
//    }

     */
}
