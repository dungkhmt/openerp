package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.*;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelExtractor {

    public OrderPickupPlanningIM extract(MultipartFile file){
        try {
            InputStream inputStream = file.getInputStream();
            HSSFWorkbook wb = new HSSFWorkbook(inputStream);
            // read staff
            HSSFSheet sheet = wb.getSheetAt(1);

            int sz = sheet.getLastRowNum();
            System.out.println("sz = " + sz);
            List<Staff> staffs = new ArrayList();
            for(int i = 1; i <= sz; i++) {
                Row r = sheet.getRow(i);
                Cell c = r.getCell(0);
                //if(c == null) System.out.println("cell " + i + " null");
                //else System.out.println("cell " + i + ": " + c.getStringCellValue());
                String staffID = "";
                if(c != null){
                    staffID = c.getStringCellValue();
                }
                staffs.add(new Staff(staffID));
            }

            // read order
            sheet =  wb.getSheetAt(2);
            sz = sheet.getLastRowNum();
            List<Order> orders = new ArrayList();
            Map<String, Order> mID2Order = new HashMap();
            for(int i = 1; i <= sz; i++){
                Row r = sheet.getRow(i);
                Cell c = r.getCell(0);
                String orderID  = "";
                if(c != null) orderID = c.getStringCellValue();
                String orderItemID = "";
                c = r.getCell(1);
                if(c != null) orderItemID = c.getStringCellValue();
                int qty = 0;
                c = r.getCell(2);
                String sqty = "";
                if(c != null)
                    qty = (int)c.getNumericCellValue();
                //System.out.println("order " + orderID + " sqty = " + sqty);
                double weight = 0;
                c = r.getCell(3);
                if(c != null)
                    weight = c.getNumericCellValue();
                Order order = mID2Order.get(orderID);
                if(order == null){
                    order = new Order(orderID, new ArrayList(),"");
                    orders.add(order);
                    mID2Order.put(orderID,order);
                }
                order.getItems().add(new OrderItem(orderItemID,qty,weight));
            }

            // read shelfs
            sheet   = wb.getSheetAt(5);
            sz = sheet.getLastRowNum();
            Map<String, Shelf> mID2Shelf = new HashMap();
            List<Shelf> shelfs = new ArrayList();
            for(int i = 1; i <= sz; i++){
                Row r = sheet.getRow(i);
                String shelfID = "";
                Cell c = r.getCell(0);
                if(c != null) shelfID = c.getStringCellValue();
                String orderItemID = "";
                int qty = 0;
                c = r.getCell(1);
                if(c != null) orderItemID = c.getStringCellValue();
                c = r.getCell(2);
                if(c != null) qty = (int)(c.getNumericCellValue());
                Shelf shelf = mID2Shelf.get(shelfID);
                if(shelf == null) {
                    //System.out.println("ExcelExtractor, shelf " + shelfID + " not exists, create new");
                    shelf = new Shelf(shelfID, new ArrayList());
                    mID2Shelf.put(shelfID,shelf);
                    shelfs.add(shelf);
                }
                shelf.getItems().add(new OrderItem(orderItemID,qty,0));
            }

            // read distances
            sheet = wb.getSheetAt(4);
            sz = sheet.getLastRowNum();
            List<DistanceElement> distances = new ArrayList();
            for(int i = 1; i <= sz; i++){
                Row r = sheet.getRow(i);
                String fromShelfID = "";
                String toShelfID = "";
                double dis = 0;
                Cell c = r.getCell(0);
                if(c != null) fromShelfID = c.getStringCellValue();
                c = r.getCell(1);
                if(c != null) toShelfID = c.getStringCellValue();
                c = r.getCell(2);
                if(c != null) dis = (double)(c.getNumericCellValue());
                //System.out.println("ExcelExtractor, read distance " + i + "/" + sz + " from " + fromShelfID + " to " + toShelfID + " dis = " + dis);
                distances.add(new DistanceElement(fromShelfID,toShelfID,dis));
            }

            // read doorIn & doorOut cells
            sheet = wb.getSheetAt(6);
            Row r = sheet.getRow(1);
            Cell c = r.getCell(0);
            String doorIn = c.getStringCellValue();
            r = sheet.getRow(2);
            c = r.getCell(0);
            String doorOut = c.getStringCellValue();

            sheet = wb.getSheetAt(7);
            r = sheet.getRow(1);
            c = r.getCell(1);
            double weightCapacity = 0;
            if(c != null) weightCapacity = c.getNumericCellValue();
            ConfigParam param = new ConfigParam(weightCapacity);

            OrderPickupPlanningIM input = new OrderPickupPlanningIM();
            input.setDistances(distances);
            input.setOrders(orders);
            input.setShelfs(shelfs);
            input.setDoorIn(doorIn);
            input.setDoorOut(doorOut);
            input.setParam(param);
            return input;
        }catch(Exception e){
                e.printStackTrace();
        }
        return null;
    }
}
