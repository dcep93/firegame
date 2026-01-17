import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import utils from "../utils/utils";

class Sidebar extends SharedSidebar {
  name = "Catan";
  rules =
    "https://www.catan.com/sites/default/files/2021-06/catan_base_rules_2020_200707.pdf";
  utils = utils;
}

export default Sidebar;
