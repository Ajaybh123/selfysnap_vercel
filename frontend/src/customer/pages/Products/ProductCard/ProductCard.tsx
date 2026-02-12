import "./ProductCard.css";
import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Box, Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import { isWishlisted } from "../../../../util/isWishlisted";
import ChatBot from "../../ChatBot/ChatBot";

interface ProductCardProps {
  item: Product;
  categoryId?: string; // optional override
  isHomePage?: boolean;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  borderRadius: ".5rem",
  boxShadow: 24,
};

const ProductCard: React.FC<ProductCardProps> = ({ item, categoryId, isHomePage = false }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const { wishlist } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (item._id) dispatch(addProductToWishlist({ productId: item._id }));
  };

  const handleShowChatBot = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowChatBot(true);
  };

  const handleCloseChatBot = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    event.stopPropagation();
    setShowChatBot(false);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isHovered && item.images?.length) {
      interval = window.setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % item.images.length);
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isHovered, item.images]);

  // ✅ Fix: use category?.categoryId, remove non-existent item.categoryId
  const resolvedCategoryId = categoryId || item.category?.categoryId;

  return (
    <>
      <div
        onClick={() =>
          navigate(`/product-details/${resolvedCategoryId}/${item.title}/${item._id}`)
        }
        className="group px-4 relative cursor-pointer"
      >
        <div
          className="card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {item.images.map((image, index) => (
            <img
              key={index}
              className="card-media object-top"
              src={image}
              alt={`product-${index}`}
              style={{
                transform: `translateX(${(index - currentImage) * 100}%)`,
              }}
            />
          ))}

          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-4">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator-button ${index === currentImage ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {wishlist.wishlist && (
                  <Button variant="contained" color="secondary" sx={{ zIndex: 10 }} onClick={handleAddWishlist}>
                    {isWishlisted(wishlist.wishlist, item) ? (
                      <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "gray" }} />
                    )}
                  </Button>
                )}

                {!isHomePage && (
                  <Button onClick={handleShowChatBot} color="secondary" variant="contained">
                    <ModeCommentIcon sx={{ color: "orange" }} />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          {!isHomePage && (
            <h1 className="font-semibold text-lg">
              {item.seller?.businessDetails?.businessName}
            </h1>
          )}

          <p>{item.title}</p>

          <div className="price flex items-center gap-3">
            <span className="font-semibold text-gray-800">₹{item.sellingPrice}</span>

            {!isHomePage && item.mrpPrice && (
              <>
                <span className="text thin-line-through text-gray-400">₹{item.mrpPrice}</span>
                {item.discountPercent && (
                  <span className="text-[#f47e24] font-semibold">{item.discountPercent}% off</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showChatBot && (
        <Modal open onClose={handleCloseChatBot}>
          <Box sx={style}>
            <ChatBot handleClose={handleCloseChatBot} productId={item._id} />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ProductCard;
