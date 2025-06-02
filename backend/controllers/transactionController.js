const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// Crear una nueva transacción
exports.createTransaction = async (req, res) => {
    try {
        const { type, product: productId, quantity, reason, reference } = req.body;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar inventario del producto
        if (type === 'entry') {
            product.quantity += quantity;
        } else if (type === 'exit') {
            // Verificar si hay suficiente stock
            if (product.quantity < quantity) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
            product.quantity -= quantity;
        }

        await product.save();

        // Crear la transacción
        const transaction = await Transaction.create({
            type,
            product: productId,
            quantity,
            reason,
            reference,
            user: req.user._id
        });

        await transaction.populate('product user', 'name email');

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las transacciones
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('product user', 'name email');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener transacciones por producto
exports.getTransactionsByProduct = async (req, res) => {
   try {
     const transactions = await Transaction.find({ product: req.params.productId })
       .populate('product user', 'name email');
     
     res.json(transactions);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };