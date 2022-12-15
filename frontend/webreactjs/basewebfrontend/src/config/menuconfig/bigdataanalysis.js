export const bigdataanalysis = {
  id: "MENU_BIGDATA_ANALYSIS",
  path: "",
  isPublic: false,
  icon: "BigData Analysis",
  text: "Big Data Analysis",
  child: [
    {
      id: "MENU_BIGDATA_ANALYSIS_VIEW_QUALITY_CHECK",
      path: "/bigdataanalysis/quality-check-result",
      isPublic: false,
      icon: "StarBorder",
      text: "Quality Check",
      child: [],
    },
    {
      id: "MENU_BIGDATA_ANALYSIS_DEFINE_RULE_QUALITY_CHECK",
      path: "/bigdataanalysis/quality-check/define-rules",
      isPublic: false,
      icon: "StarBorder",
      text: "Define Rules - Quality Check",
      child: [],
    },
    {
      id: "MENU_BIGDATA_ANALYSIS_LIST_DATA_QUALITY_CHECK_MASTER",
      path: "/bigdataanalysis/data-quality-check-master/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Data Quality Check Master",
      child: [],
    },
  ],
};
