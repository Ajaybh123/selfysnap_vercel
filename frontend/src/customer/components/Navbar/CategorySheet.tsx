import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const CategorySheet = ({
  selectedCategory,
  toggleDrawer,
  setShowSheet,
}: any) => {
  const navigate = useNavigate();
  const { categories } = useAppSelector((store) => store.mainCategory);

  const levelTwo = categories.filter(
    (cat) =>
      cat.level === 2 && cat.parentCategoryId === selectedCategory
  );

  const levelThree = categories.filter((cat) => cat.level === 3);

  const childCategory = (parentId: string) => {
    return levelThree.filter(
      (child) => child.parentCategoryId === parentId
    );
  };

  const handleCategoryClick = (category: string) => {
    if (toggleDrawer) toggleDrawer(false)();
    if (setShowSheet) setShowSheet(false);
    navigate("/products/" + category);
  };

  return (
    <Box className="bg-white shadow-lg  lg:h-[500px] overflow-y-auto">
      <div className=" flex text-sm flex-wrap">
        {levelTwo.map((item: any, index: number) => (
          <div
            key={item.name}
            className={`p-8 lg:w-[20%] ${index % 2 === 0 ? "bg-slate-50" : "bg-white"
              }`}
          >
            <p className="text-[#df6b3c] mb-5 font-semibold">{item.name}</p>

            <ul className="space-y-3">
              {childCategory(item.categoryId).map((child: any) => (
                <div key={child.name}>
                  <li
                    onClick={() =>
                      handleCategoryClick(child.categoryId)
                    }
                    className="hover:text-[#df6b3c] cursor-pointer"
                  >
                    {child.name}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default CategorySheet;
