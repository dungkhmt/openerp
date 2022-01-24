package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.ClassTeacherAssignmentSolutionModel;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimetableConflictChecker;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.usermodel.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.List;

@Log4j2
public class ClassTeacherAssignmentSolutionExcelExporter {

    private XSSFWorkbook workbook = new XSSFWorkbook();

    private XSSFSheet sheet;

    private List<ClassTeacherAssignmentSolutionModel> solution;

    public ClassTeacherAssignmentSolutionExcelExporter(List<ClassTeacherAssignmentSolutionModel> classTeacherAssignmentSolutionModels) {
        this.solution = classTeacherAssignmentSolutionModels;
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("DS phân công");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(row, 0, "Mã lớp", style);
        createCell(row, 1, "Mã học phần", style);
        createCell(row, 2, "Tên học phần", style);
        createCell(row, 3, "Giáo viên", style);
        createCell(row, 4, "TKB", style);

    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void writeDataLines() {
        for (int i = 0; i < solution.size(); i++) {
            ClassTeacherAssignmentSolutionModel s = solution.get(i);
            Row row = sheet.createRow(i + 1);

            CellStyle style = workbook.createCellStyle();
            XSSFFont font = workbook.createFont();
            font.setBold(false);
            font.setFontHeight(16);
            style.setFont(font);

            createCell(row, 0, s.getClassCode(), style);
            createCell(row, 1, s.getCourseId(), style);
            createCell(row, 2, s.getCourseName(), style);
            createCell(row, 3, s.getTeacherName(), style);
            createCell(row, 4, s.getTimetable(), style);

        }

    }

//    public void export(HttpServletResponse response) throws IOException {
//        writeHeaderLine();
//        writeDataLines();
//
//        ServletOutputStream outputStream = response.getOutputStream();
//        workbook.write(outputStream);
//        workbook.close();
//
//        outputStream.close();
//        System.out.println("export: FINISHED write to response");
//
//    }

    public ByteArrayInputStream toExcel() {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            writeHeaderLine();
            writeDataLines();

            toTemplateExcel();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Creates a cell and style it a certain way.
     *
     * @param row    the row to create the cell in
     * @param column the column number to create the cell in
     */
    private static Cell createCell(
        Row row,
        int column,
        CellStyle cellStyle
    ) {
        Cell cell = row.createCell(column);
        cell.setCellStyle(cellStyle);
        return cell;
    }

    /**
     * Creates a merged cell and style it a certain way.
     *
     * @param sheet        the sheet
     * @param rangeAddress
     * @param value
     * @param cellStyle
     */
    private void createMergedCell(
        XSSFSheet sheet,
        CellRangeAddress rangeAddress,
        Object value,
        CellStyle cellStyle
    ) {
        Row row = sheet.getRow(rangeAddress.getFirstRow());

        if (row == null) {
            row = sheet.createRow(rangeAddress.getFirstRow());
        }

        int column = rangeAddress.getFirstColumn();
        Cell cell = row.createCell(column);

        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }

        sheet.addMergedRegion(rangeAddress);
        setBorderStyles(cellStyle);
        cell = row.getCell(column);
        cell.setCellStyle(cellStyle);
    }

    /**
     * Set border styles for all merged cellin sheet.
     *
     * @param sheet the sheet
     */
    private void setBordersToMergedCells(Sheet sheet) {
        List<CellRangeAddress> mergedRegions = sheet.getMergedRegions();
        for (CellRangeAddress rangeAddress : mergedRegions) {
            RegionUtil.setBorderTop(BorderStyle.THIN, rangeAddress, sheet);
            RegionUtil.setBorderLeft(BorderStyle.THIN, rangeAddress, sheet);
            RegionUtil.setBorderRight(BorderStyle.THIN, rangeAddress, sheet);
            RegionUtil.setBorderBottom(BorderStyle.THIN, rangeAddress, sheet);
        }
    }

    /**
     * Set border styles for normal cell.
     *
     * @param style
     */
    private void setBorderStyles(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());

        style.setBorderRight(BorderStyle.THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());

        style.setBorderLeft(BorderStyle.THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());

        style.setBorderTop(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
    }

    private void toTemplateExcel() {
        XSSFSheet sheet = workbook.createSheet("DS phân công theo mẫu");

        // Styling.
        sheet.setColumnWidth(0, 30 * 256);
        for (short i = 1; i < 61; i++) {
            sheet.setColumnWidth(i, 4 * 256);
        }

        // Header styles.
        XSSFCellStyle headerStyles = workbook.createCellStyle();
        headerStyles.setAlignment(HorizontalAlignment.CENTER);
        headerStyles.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorderStyles(headerStyles);

        // First column styles.
        CellStyle firstColumnStyles = workbook.createCellStyle();
        firstColumnStyles.setAlignment(HorizontalAlignment.LEFT);
        firstColumnStyles.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorderStyles(firstColumnStyles);

        // Class styles.
        XSSFCellStyle classStyles = workbook.createCellStyle();
        classStyles.setAlignment(HorizontalAlignment.CENTER);
        classStyles.setVerticalAlignment(VerticalAlignment.CENTER);

        String rgbS = "F2F2F2";
        byte[] rgbB = new byte[0]; // get byte array from hex string
        try {
            rgbB = Hex.decodeHex(rgbS);
        } catch (DecoderException e) {
            e.printStackTrace();
        }

        XSSFColor color = new XSSFColor(rgbB, null); //IndexedColorMap has no usage until now. So it can be set null.
        classStyles.setFillForegroundColor(color);
        classStyles.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Start construct header.
        createMergedCell(
            sheet,
            new CellRangeAddress(1, 3, 0, 0),
            "Giảng viên",
            headerStyles);

        // Create column for weekdays.
        Row sessionRow = sheet.createRow(3);
        for (short i = 0; i < 5; i++) {
            createMergedCell(
                sheet,
                new CellRangeAddress(1, 1, 1 + i * 12, 12 + i * 12),
                "Thứ " + (i + 2),
                headerStyles);

            createMergedCell(
                sheet,
                new CellRangeAddress(2, 2, 1 + i * 12, 6 + i * 12),
                "Sáng",
                headerStyles);

            createMergedCell(
                sheet,
                new CellRangeAddress(2, 2, 7 + i * 12, 12 + i * 12),
                "Chiều",
                headerStyles);

            for (short j = 0; j < 12; j++) {
                Cell cell = createCell(
                    sessionRow,
                    1 + i * 12 + j,
                    headerStyles);

                cell.setCellValue(j + 1);
            }
        }

        // Write data.
        Collections.sort(
            solution,
            (firstClass, secondClass) -> firstClass
                .getTeacherId()
                .compareToIgnoreCase(secondClass.getTeacherId()));

        String previousTeacher = "";
        Row row;
        int currentRowIndex = 3;

        for (int i = 0; i < solution.size(); i++) {
            ClassTeacherAssignmentSolutionModel solution = this.solution.get(i);

            if (solution.getTeacherId().compareToIgnoreCase(previousTeacher) != 0) {
                previousTeacher = solution.getTeacherId();
                currentRowIndex++;
                row = sheet.createRow(currentRowIndex);

                Cell teacherNameCell = createCell(row, 0, firstColumnStyles);
                teacherNameCell.setCellValue(solution.getTeacherName());
            }

            String periodStr = TimetableConflictChecker.extractPeriod(solution.getTimetable());

            if (periodStr != null) { // Ignore all classes which timetable is null.
                // Extract period to define position.
                String[] period = periodStr.split(",");

                String start = period[0];
                String end = period[1];
                int weekDay = Integer.parseInt(start.substring(0, 1));
                int startSession = Integer.parseInt(start.substring(1, 2)) - 1;
                int startPeriod = Integer.parseInt(start.substring(2));
                int endSession = Integer.parseInt(end.substring(1, 2)) - 1;
                int endPeriod = Integer.parseInt(end.substring(2));

                createMergedCell(
                    sheet,
                    new CellRangeAddress(
                        currentRowIndex,
                        currentRowIndex,
                        1 + (weekDay - 2) * 12 + 6 * startSession + startPeriod - 1,
                        1 + (weekDay - 2) * 12 + 6 * endSession + endPeriod - 1),
                    Integer.parseInt(solution.getClassCode()),
                    classStyles
                );
            } else {
                log.info("TIMETABLE IS NULL WITH CLASSCODE " + solution.getClassCode());
            }
        }

        setBordersToMergedCells(sheet);
    }
}
