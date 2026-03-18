import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 连接数据库（用环境变量）
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 产品模型
const Product = mongoose.model("Product", {
  name: String,
  price: String,
  image: String,
});

// 登录
const ADMIN = {
  username: "admin",
  password: "123456"
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 上传
const upload = multer({ dest: "uploads/" });

app.post("/api/products", upload.single("image"), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
  });
  await product.save();
  res.json({ success: true });
});

// 获取
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 删除
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ 关键：使用 Render 提供的端口
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
