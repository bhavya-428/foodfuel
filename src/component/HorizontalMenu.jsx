import React, { useState, useContext } from 'react';
import { StoreContext } from '../StoreContext';
import './HorizontalMenu.css';

const categories = [
  { name: "All" },
  { name: "Ice Creams"},
  { name: "Sundaes" },
  { name: "Waffles" },
  { name: "Shakes" },
  { name: "Cakes" },
  { name: "Smoothies" },
  { name: "Shawarma"},
  { name: "Starters"  },
  { name: "Pizzas"  },
];

const menuItems = [
  { id: 1, name: 'Vanilla Bean Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://sugarpursuit.com/wp-content/uploads/2023/05/Vanilla-bean-ice-cream-thumbnail.jpg' },
  { id: 2, name: 'Belgian Chocolate Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://5.imimg.com/data5/SELLER/Default/2023/3/UM/MI/JG/13714945/hei-ice-cream.jpeg' },
  { id: 4, name: 'Vanilla Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://static.toiimg.com/thumb/54677722.cms?imgsize=134423&width=800&height=800' },
  { id: 5, name: 'Strawberry Ice Cream', type: 'Ice Creams', price: '70/-', img: 'https://i0.wp.com/www.queenofmykitchen.com/wp-content/uploads/2016/06/New-51.jpg?ssl=1' },
  { id: 6, name: 'Chocolate Ice Cream', type: 'Ice Creams', price: '90/-', img: 'https://cdn.loveandlemons.com/wp-content/uploads/2025/05/chocolate-ice-cream.jpg' },
  { id: 7, name: 'Butterscotch Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/butterscotch-ice-cream-recipe-500x500.jpg' },
  { id: 8, name: 'Mango Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://cdn1.foodviva.com/static-content/food-images/dessert-recipes/mango-ice-cream/mango-ice-cream.jpg' },
  { id: 9, name: 'Cookies & Cream Ice Cream', type: 'Ice Creams', price: '70/-', img: 'https://www.kingarthurbaking.com/sites/default/files/2022-05/cookies-and-cream-ice-cream_0422.jpg' },
  { id: 10, name: 'Pistachio Ice Cream', type: 'Ice Creams', price: '80/-', img: 'https://aclassictwist.com/wp-content/uploads/2025/05/No-Churn-Pistachio-Ice-Cream-13-720x540.jpg' },
  { id: 11, name: 'Coffee Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://butternutbakeryblog.com/wp-content/uploads/2023/07/no-churn-vegan-cookie-dough-ice-cream.jpg' },
  { id: 12, name: 'Caramel Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://cupcakesandcouscous.com/wp-content/uploads/2017/03/d1311-salted2bcaramel2bice2bcream2b72bof2b7.jpg' },
  { id: 13, name: 'Mint Chocolate Chip Ice Cream', type: 'Ice Creams', price: '50/-', img: 'https://cleanfoodcrush.com/wp-content/uploads/2021/09/clean-eating-simple-Homemade-Mint-Chocolate-Chip-Ice-Cream-recipe.jpg' },
  { id: 14, name: 'Chocolate Fudge Sundae', type: 'Sundaes', price: '$6.99', img: 'https://static01.nyt.com/images/2017/09/10/magazine/10ondessert/10ondessert-jumbo.jpg' },
  { id: 15, name: 'Belgian Waffle', type: 'Waffles', price: '$8.99', img: 'https://content.jdmagicbox.com/v2/comp/mumbai/r5/022pxx22.xx22.190116204535.h5r5/catalogue/the-belgian-waffle-co--goregaon-west-mumbai-waffle-centres-0ps2dlrmuc.jpg' },
  { id: 17, name: 'New York Cheesecake', type: 'Desserts', price: '$7.50', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop' },
  { id: 19, name: 'Berry Smoothie', type: 'Smoothies', price: '$6.00', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop' },
  { id: 20, name: 'Hot Fudge Sundae', type: 'Sundaes', price: '$6.99', img: 'https://feelslikehomeblog.com/wp-content/uploads/2024/04/gluten-free-hot-fudge-brownie-sundae-recipe-square-featured.png' },
  { id: 21, name: 'Death by Chocolate Sundae', type: 'Sundaes', price: '$6.99', img: 'https://static01.nyt.com/images/2024/05/24/multimedia/dp-death-by-chocolate-qmlv/dp-death-by-chocolate-qmlv-threeByTwoMediumAt2X.jpg' },
  { id: 22, name: 'Jar Sundae', type: 'Sundaes', price: '$6.99', img: 'https://c8.alamy.com/comp/HE6C1Y/whipped-cream-with-a-cherry-in-a-glass-jar-close-up-vertical-HE6C1Y.jpg' },
  { id: 23, name: 'Sizzling Sundae', type: 'Sundaes', price: '$6.99', img: 'https://foodu.in/wp-content/uploads/2024/05/b7321bce-d585-45a4-b3b8-96f563374488.jpg' },
  { id: 24, name: 'Waffle Sundae', type: 'Sundaes', price: '$6.99', img: 'https://hips.hearstapps.com/hmg-prod/images/homemade-waffle-cup-sundae-recipe-2-646bb657bba53.jpg?crop=0.502xw:1.00xh;0.436xw,0&resize=1200:*' },
  { id: 25, name: 'Chocolate Waffle', type: 'Waffles', price: '$6.49', img: 'https://cdn.shopify.com/s/files/1/0173/8181/8422/files/20240523183203-screenshot-202024-05-10-20at-204.png?v=1716489126&width=1600&height=900' },
  { id: 26, name: 'Nutella Waffle', type: 'Waffles', price: '$6.99', img: 'https://foodexitrecipes.com/wp-content/uploads/2025/03/Nutella-Waffles-12.jpg' },
  { id: 27, name: 'Strawberry Waffle', type: 'Waffles', price: '$6.59', img: 'https://99pancakes.in/cdn/shop/files/CreamyStrawberrywaffle.jpg?v=1755018743&width=1920' },
  { id: 28, name: 'Banana Caramel Waffle', type: 'Waffles', price: '$6.79', img: 'https://99pancakes.in/cdn/shop/files/CaramelizedBananaWaffle.jpg?v=1755018713&width=1920' },
  { id: 29, name: 'Oreo Waffle', type: 'Waffles', price: '$6.99', img: 'https://madno.co.in/cdn/shop/files/Kit-Kat-Oreo-Waffle-The-Ultimate-Cookie-Candy-Crunch-Madno-35254468608155.jpg?v=1768286397' },
  { id: 30, name: 'KitKat Waffle', type: 'Waffles', price: '$7.29', img: 'https://99pancakes.in/cdn/shop/products/KitKat_1.jpg' },
  { id: 31, name: 'Brownie Waffle', type: 'Waffles', price: '$7.49', img: 'https://www.kyleecooks.com/wp-content/uploads/2020/08/Brownie-Waffles-35.jpg' },
  { id: 32, name: 'Ice Cream Waffle', type: 'Waffles', price: '$7.99', img: 'https://www.prairiefarms.com/wp-content/uploads/files/2023/WaffleSundae.jpg' },
  { id: 33, name: 'Bubble Waffle', type: 'Waffles', price: '$6.89', img: 'https://ald.kitchen/cdn/shop/articles/shutterstock_1698605785.jpg?v=1689723923' },
  { id: 34, name: 'Chocolate Shake', type: 'Shakes', price: '$4.99', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699' },
  { id: 35, name: 'Strawberry Shake', type: 'Shakes', price: '$4.79', img: 'https://www.thehungrybites.com/wp-content/uploads/2023/06/Strawberry-milkshake-frappuccino-featured.jpg' },
  { id: 36, name: 'Vanilla Shake', type: 'Shakes', price: '$4.49', img: 'https://icecreamfromscratch.com/wp-content/uploads/2022/08/Vanilla-Milkshake-1.2-720x720.jpg' },
  { id: 37, name: 'Oreo Shake', type: 'Shakes', price: '$5.49', img: 'https://www.whiskaffair.com/wp-content/uploads/2020/07/Oreo-Milkshake-2-3.jpg' },
  { id: 38, name: 'KitKat Shake', type: 'Shakes', price: '$5.69', img: 'https://funmoneymom.com/wp-content/uploads/2024/12/Kit-Kat-Milkshake-14.jpg' },
  { id: 39, name: 'Mango Shake', type: 'Shakes', price: '$4.99', img: 'https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Mango-Shake-Thumbnail.jpg' }, 
  { id: 40, name: 'Banana Shake', type: 'Shakes', price: '$4.59', img: 'https://2cookinmamas.com/wp-content/uploads/2023/04/Banana-Milkshake-garnished-square-500x500.jpg' },
  { id: 41, name: 'Cold Coffee Shake', type: 'Shakes', price: '$5.19', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735' },
  { id: 42, name: 'Caramel Shake', type: 'Shakes', price: '$5.29', img: 'https://www.queensleeappetit.com/wp-content/uploads/2018/05/Salted-Caramel-Milkshake-9.jpg' }, 
  { id: 43, name: 'Peanut Butter Shake', type: 'Shakes', price: '$5.79', img: 'https://www.simplyquinoa.com/wp-content/uploads/2014/08/healthy-peanut-butter-milkshake-10.jpg' },
  { id: 44, name: 'Chocolate Cake', type: 'Cakes', price: '$8.99', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
  { id: 45, name: 'Black Forest Cake', type: 'Cakes', price: '$9.49', img: 'https://i.ytimg.com/vi/OEFv_N_Ztmc/maxresdefault.jpg' },
  { id: 46, name: 'Red Velvet Cake', type: 'Cakes', price: '$9.99', img: 'https://cdn.prod.website-files.com/614a379840dbad1848e598c2/679906d29abceb2bbceb06b3_6799062816366d61273c52b4_IMG_1560.jpeg' },
  { id: 47, name: 'Vanilla Cake', type: 'Cakes', price: '$8.49', img: 'https://atsloanestable.com/wp-content/uploads/2022/01/small-vanilla-cake3.jpg' },
  { id: 48, name: 'Strawberry Cake', type: 'Cakes', price: '$9.29', img: 'https://veenaazmanov.com/wp-content/uploads/2025/01/Strawberry-Layer-Cake-Recipe20.jpg' },
  { id: 49, name: 'Butterscotch Cake', type: 'Cakes', price: '$9.59', img: 'https://bakebuddy.in/cdn/shop/files/Traditional_Butterscotch_Cake_e77ad1d9-833f-41d8-a33f-3848eafec479.jpg?v=1706457890' },
  { id: 50, name: 'Pineapple Cake', type: 'Cakes', price: '$8.99', img: 'https://giftnmore.in/wp-content/uploads/2024/08/Cream-drop-Pineapple-cake-5.jpeg' },
  { id: 51, name: 'Chocolate Truffle Cake', type: 'Cakes', price: '$10.49', img: 'https://www.giftechglobal.com/cdn/shop/files/Cherry-Vanilla-Pink-Rosette-Cake-001-Photoroom_4.webp?v=1746442249' },
  { id: 52, name: 'KitKat Cake', type: 'Cakes', price: '$10.99', img: 'https://svcaketvl.in/wp-content/uploads/2024/05/kitkat-cake.jpg' },
  { id: 53, name: 'Oreo Cake', type: 'Cakes', price: '$10.79', img: 'https://www.doorstepcake.com/wp-content/uploads/2022/06/oreo-drip-cake-510x455-1.jpg' },
  { id: 54, name: 'Strawberry Smoothie', type: 'Smoothies', price: '$5.49', img: 'https://myfoodstory.com/wp-content/uploads/2017/05/Frozen-Strawberry-Greek-Yogurt-Smoothie-10-minute-Breakfast-4.jpg' },
  { id: 55, name: 'Mango Smoothie', type: 'Smoothies', price: '$5.29', img: 'https://greenheartlove.com/wp-content/uploads/2022/08/tropical-mango-smoothie-vegan-1024x683.jpg' },
  { id: 56, name: 'Banana Smoothie', type: 'Smoothies', price: '$4.99', img: 'https://cadryskitchen.com/wp-content/uploads/2017/03/pb-banana-smoothie.jpg' },
  { id: 57, name: 'Mixed Berry Smoothie', type: 'Smoothies', price: '$5.79', img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625' },
  { id: 58, name: 'Pineapple Smoothie', type: 'Smoothies', price: '$5.19', img: 'https://cdn.healthyrecipes101.com/recipes/images/smoothies/healthy-pineapple-smoothie-closcbvvr000q5b1beqbofwk9.jpg' },
  { id: 59, name: 'Green Detox Smoothie', type: 'Smoothies', price: '$5.99', img: 'https://cdn.shopify.com/s/files/1/0851/2644/7384/files/6dd895_cb5d0be5a99d4accb4f73cde7c479f8c_mv2_1024x1024.jpg' },
  { id: 60, name: 'Avocado Smoothie', type: 'Smoothies', price: '$6.29', img: 'https://joyfoodsunshine.com/wp-content/uploads/2022/05/banana-avocado-smoothie-recipe-5.jpg' },
  { id: 61, name: 'Chocolate Banana Smoothie', type: 'Smoothies', price: '$5.89', img: 'https://www.sonshinekitchen.com/wp-content/uploads/2018/03/chocolate-banana-milkshake-10.jpg' },
  { id: 62, name: 'Peanut Butter Smoothie', type: 'Smoothies', price: '$6.19', img: 'https://hips.hearstapps.com/hmg-prod/images/peanut-butter-banana-smoothie-index-64e6355f938fd.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*' },
  { id: 63, name: 'Blueberry Smoothie', type: 'Smoothies', price: '$5.69', img: 'https://evergreenkitchen.ca/wp-content/uploads/2024/03/Blueberry-Raspberry-Smoothie-Evergreen-Kitchen-1.jpg' },
  { id: 64, name: 'Chicken Shawarma', type: 'Shawarma', price: '$5.99', img: 'https://foxeslovelemons.com/wp-content/uploads/2023/06/Chicken-Shawarma-8.jpg' },
  { id: 65, name: 'Mutton Shawarma', type: 'Shawarma', price: '$6.49', img: 'https://imagecdn.farziengineer.co/cambaytiger/hosted/Slow-Cooked_Lamb_Shawarma-7725ed95d1b9.png' },
  { id: 66, name: 'Beef Shawarma', type: 'Shawarma', price: '$6.29', img: 'https://bbqingwiththenolands.com/wp-content/uploads/2024/08/Beef-Shawarma-Wrapped-in-paper-1200-30.jpg' },
  { id: 67, name: 'Paneer Shawarma', type: 'Shawarma', price: '$5.49', img: 'https://coox-new.s3.ap-south-1.amazonaws.com/images/d/dishes/Paneer%20Shawarma-28-dish-img.jpeg?v=1761996283179' },
  { id: 68, name: 'Zinger Shawarma', type: 'Shawarma', price: '$6.99', img: 'https://thumbs.dreamstime.com/b/zinger-chicken-broast-wrapped-fried-chicken-s-either-zesty-spicy-fillet-crispy-golden-broasted-piece-380661647.jpg' },
  { id: 69, name: 'Cheese Shawarma', type: 'Shawarma', price: '$6.79', img: 'https://dukaan.b-cdn.net/1000x1000/webp/projecteagle/images/082fa5c3-b015-4785-87cb-dc20930220ea.jpg' },
  { id: 70, name: 'Spicy Shawarma', type: 'Shawarma', price: '$6.19', img: 'https://5.imimg.com/data5/SELLER/Default/2023/10/351951831/CF/RN/BT/111469120/mexican-shawarma-masala-spicy.jpg' },
  { id: 71, name: 'Double Chicken Shawarma', type: 'Shawarma', price: '$7.49', img: 'https://chowdeck.com/store/_next/image?url=https%3A%2F%2Ffiles.chowdeck.com%2Ffit-in%2F1200x675%2Fimages%2F2025%2F2025-02-11%2F6JGs8oaHMcSufi8duI0op.png&w=3840&q=75' },
  { id: 72, name: 'Arabian Shawarma', type: 'Shawarma', price: '$6.59', img: 'https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/8/5dc4ea3f-6099-40fb-8386-ee34ef3194f6_735449.ss.jpg' },
  { id: 73, name: 'Jumbo Shawarma', type: 'Shawarma', price: '$7.99', img: 'https://content.jdmagicbox.com/comp/def_content/shawarma_centres/default-shawarma-centres-7.jpg' },
  { id: 74, name: 'Chicken Lollipop', type: 'Starters', price: '$6.49', img: 'https://iheartumami.com/wp-content/uploads/2023/04/chicken-lollipop-recipe.jpg' },
  { id: 75, name: 'Chicken Wings', type: 'Starters', price: '$6.99', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlqIIhMErgrovGJuVPtcpAh_ZkO_t6pUB1qw&s' },
  { id: 76, name: 'Chicken 65', type: 'Starters', price: '$6.79', img: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-restaurant-style-500x500.jpg' },
  { id: 77, name: 'Grilled Chicken', type: 'Starters', price: '$7.49', img: 'https://spiceindiaonline.com/wp-content/uploads/2021/05/Tandoori-Chicken-20-500x400.jpg  ' },
  { id: 78, name: 'Chicken Tikka', type: 'Starters', price: '$7.29', img: 'https://signatureconcoctions.com/wp-content/uploads/2024/05/Chicken-Tikka-1-scaled.jpg' },
  { id: 79, name: 'Fish Fry', type: 'Starters', price: '$7.59', img: 'https://www.kannammacooks.com/wp-content/uploads/masala-fish-fry-recipe-ayala-meen-Mackerel-fry-8.jpg' },
  { id: 80, name: 'Prawns Fry', type: 'Starters', price: '$8.49', img: 'https://rupal-bhatikar.com/wp-content/uploads/2020/07/DSC03664-1.jpg' },
  { id: 81, name: 'Chicken Nuggets', type: 'Starters', price: '$5.99', img: 'https://www.allrecipes.com/thmb/Dw_WFOvCds43ksPxkrE60qxcwSk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-8849-HomemadeChickenNuggets-beauty-4x3-ca915ee936054272af1b506181923c7f.jpg' },
  { id: 82, name: 'Drums of Heaven', type: 'Starters', price: '$7.99', img: 'https://jalojog.com/wp-content/uploads/2024/02/sddefault.jpg' },
  { id: 83, name: 'Pepper Chicken', type: 'Starters', price: '$7.39', img: 'https://www.sharmispassions.com/wp-content/uploads/2012/06/PepperChicken6.jpg' },
  { id: 84, name: 'Margherita Pizza', type: 'Pizzas', price: '$7.99', img: 'https://lilluna.com/wp-content/uploads/2025/10/margherita-pizza-resize-8-1.jpg' },
  { id: 85, name: 'Farmhouse Pizza', type: 'Pizzas', price: '$8.49', img: 'https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/f9701b4e9e6aae4febe5e52c9f5e36f9' },
  { id: 86, name: 'Pepperoni Pizza', type: 'Pizzas', price: '$9.49', img: 'https://assets-us-01.kc-usercontent.com/4353bced-f940-00d0-8c6e-13a0a4a7f5c2/2ac60829-5178-4a6e-80cf-6ca43d862cee/Quick-and-Easy-Pepperoni-Pizza-700x700.jpeg?w=1280&auto=format' },
  { id: 87, name: 'BBQ Chicken Pizza', type: 'Pizzas', price: '$9.99', img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65' },
  { id: 88, name: 'Veggie Supreme Pizza', type: 'Pizzas', price: '$8.99', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002' },
  { id: 89, name: 'Cheese Burst Pizza', type: 'Pizzas', price: '$9.79', img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c' },
  { id: 90, name: 'Paneer Tikka Pizza', type: 'Pizzas', price: '$9.29', img: 'https://blendofspicesbysara.com/wp-content/uploads/2020/05/Screenshot_20200509-234417.png' },
  { id: 91, name: 'Mexican Pizza', type: 'Pizzas', price: '$9.59', img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65' },
  { id: 92, name: 'Chicken Dominator Pizza', type: 'Pizzas', price: '$10.49', img: 'https://5.imimg.com/data5/DM/ES/MY-29540739/chicken-dominator.png' },
  { id: 93, name: 'Four Cheese Pizza', type: 'Pizzas', price: '$10.29', img: 'https://static.toiimg.com/photo/59123476.cms' },
  { id: 94, name: 'Strawberry Sundae', type: 'Sundaes', price: '$6.49', img: 'https://tummy-to-heart.com/wp-content/uploads/2021/06/4O1A7470-500x500.png' },
  { id: 95, name: 'Caramel Sundae', type: 'Sundaes', price: '$6.59', img: 'https://www.hersheyfoodservice.com/content/dam/hershey-foodservice/images/recipes/upscaled/200_7127_large.jpg' },
  { id: 96, name: 'Butterscotch Sundae', type: 'Sundaes', price: '$6.69', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQts4YQeyy9ofpMZj1qRMie2WECiQ-7lLEdzA&s' },
  { id: 97, name: 'Oreo Sundae', type: 'Sundaes', price: '$6.79', img: 'https://www.havmor.com/sites/default/files/styles/502x375/public/gallery/Oreo%20Overload.jpg?itok=b41OTGQa' },
  { id: 98, name: 'Banana Split Sundae', type: 'Sundaes', price: '$6.99', img:'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FSeries%2F2021-05-how-to-banana-split%2F2021-05-18_ATK-0453' },
  { id: 99, name: 'Mango Sundae', type: 'Sundaes', price: '$6.59', img: 'https://thumbs.dreamstime.com/b/delicious-ice-cream-sundae-topped-fresh-mango-chocolate-sauce-perfect-sweet-treat-vibrant-colors-textures-379725268.jpg' },
  { id: 100, name: 'Blueberry Waffle', type: 'Waffles', price: '$6.79', img: 'https://totaste.com/wp-content/uploads/2024/07/Blueberry-Waffles.jpg' },
  { id: 101, name: 'Triple chocolate waffle', type: 'Waffles', price: '150/-', img: 'https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2025/8/1/e6c26c19-6df8-4955-9096-c62a2b445008_1162200.jpg' }
];

function HorizontalMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart, toggleWishlist, wishlist } = useContext(StoreContext);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.type === activeCategory);

  return (
    <div className="horizontal-menu-container">
      <div className="category-scroll-wrapper">
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li 
              key={index} 
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => {
          const isWishlisted = wishlist.some(w => w.id === item.id);
          return (
            <div key={item.id} className="menu-card">
              <div className="menu-card-img-container">
                <div className="menu-card-img" style={{ backgroundImage: `url(${item.img})` }}></div>
                <span className="menu-badge">{item.type}</span>
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(item)}
                  aria-label="Toggle wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "red" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <div className="menu-card-bottom">
                  <span className="menu-price">{item.price}</span>
                  <button className="add-btn" aria-label="Add to bag" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>No items found for this category yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HorizontalMenu;
