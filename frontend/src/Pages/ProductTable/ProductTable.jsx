import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, deleteProduct, exportProducts } from "../../actions/productActions";
import { fetchCategories, addCategory } from "../../actions/categoryActions";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default function ProductTable() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => ({
        products: state.products.products ?? [],
        loading: state.products.loading,
        error: state.products.error
    }));
    const { categories, categoriesLoading, categoriesError } = useSelector((state) => ({
        categories: state.categories.categories,
        categoriesLoading: state.categories.loading,
        categoriesError: state.categories.error
    }));
    const user = useSelector((state) => state.user);
    const [selectedIds, setSelectedIds] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [enabledFilter, setEnabledFilter] = useState("");
    const [modalData, setModalData] = useState({
        name: "",
        description: "",
        category_id: "",
        price: "",
        stock: "",
        enabled: true
    });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    // Load products and categories
    const loadData = useCallback(() => {
        if (!user) {
            return NotificationManager.error('Please log in to view products.', 'Error', 5000);
        }
        dispatch(fetchProducts({
            category_id: categoryId || undefined,
            enabled: enabledFilter === "" ? undefined : enabledFilter === "true",
            page: currentPage,
            per_page: pageSize
        }));
        dispatch(fetchCategories());
        setSelectedIds([]);
    }, [categoryId, enabledFilter, currentPage, pageSize, user]);

    useEffect(() => {
        if (!user) return;
        loadData();
    }, [categoryId, enabledFilter, currentPage, pageSize, user]);

    // Select all
    const toggleAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(products?.data?.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    // Select single
    const toggleOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Delete one
    const deleteOne = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await dispatch(deleteProduct([id]));
        setCurrentPage(1);
        setSelectedIds([]);
    };

    // Bulk delete (optional: implement in productActions if needed)
    const bulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("Select at least one product.");
            return;
        }
        if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;
        await dispatch(deleteProduct(selectedIds));
        setCurrentPage(1);
        setSelectedIds([]);
    };

    const openModal = () => {
        setModalData({
            name: "",
            description: "",
            category_id: "",
            price: "",
            stock: "",
            enabled: true
        });
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleModalChange = (e) => {
        const { name, value, type, checked } = e.target;
        setModalData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const submitProduct = async (e) => {
        e.preventDefault();
        const { name, description, category_id, price, stock, enabled } = modalData;
        if (!name || !category_id || !price) {
            alert("Name, Category, and Price are required.");
            return;
        }
        const response = await dispatch(addProduct({ name, description, category_id, price, stock, enabled }));
        if (response.status === 201) {
            await dispatch(fetchProducts({
                category_id: categoryId || undefined,
                enabled: enabledFilter === "" ? undefined : enabledFilter === "true",
                page: currentPage,
                per_page: pageSize
            }));
        }
        closeModal();
        setSelectedIds([]);
    };

    const openCategoryModal = () => {
        setCategoryName("");
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => setShowCategoryModal(false);

    const submitCategory = (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            alert("Category name is required.");
            return;
        }
        dispatch(addCategory({ name: categoryName }));

        closeCategoryModal();
    };

    return (
        <div className="container mt-4">
            <h3>Product Management</h3>
            <div className="row mb-3">
                <div className="col-md-8 ">
                    {/* Category filter dropdown */}
                    <select
                        className="form-select me-2"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        style={{ width: "200px", display: "inline-block" }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={openCategoryModal}
                        disabled={categoriesLoading || categoriesError || !user}
                    >
                        Add Category
                    </button>
                    <button
                        className="btn btn-primary me-2"
                        onClick={openModal}
                        disabled={!user}
                    >
                        Add Product
                    </button>
                    <button
                        className="btn btn-danger me-2"
                        onClick={bulkDelete}
                        disabled={selectedIds.length === 0}
                    >
                        Bulk Delete
                    </button>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => dispatch(exportProducts(selectedIds))}
                    >
                        Export {selectedIds.length > 0 ? 'Selected' : 'All'} to Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={enabledFilter}
                        onChange={(e) => {
                            setEnabledFilter(e.target.value);
                            setCurrentPage(1); // Reset to first page on filter change
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>
            </div>

            {/* Modal for adding category */}
            {showCategoryModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <form className="modal-content" onSubmit={submitCategory}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add Category</h5>
                                <button type="button" className="btn-close" onClick={closeCategoryModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={categoryName}
                                        onChange={e => setCategoryName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeCategoryModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for adding product */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <form className="modal-content" onSubmit={submitProduct}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add Product</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={modalData.name}
                                        onChange={handleModalChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        value={modalData.description}
                                        onChange={handleModalChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        name="category_id"
                                        value={modalData.category_id}
                                        onChange={handleModalChange}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={modalData.price}
                                        onChange={handleModalChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={modalData.stock}
                                        onChange={handleModalChange}
                                        required
                                    />
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="enabled"
                                        checked={modalData.enabled}
                                        onChange={handleModalChange}
                                    />
                                    <label className="form-check-label">Enabled</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={
                                    selectedIds.length > 0 &&
                                    selectedIds.length === products.length
                                }
                                onChange={toggleAll}
                            />
                        </th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th style={{ width: "120px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="6" className="text-center text-danger">
                                {error}
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        products?.data?.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            (products?.data ?? []).map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(p.id)}
                                            onChange={() => toggleOne(p.id)}
                                        />
                                    </td>
                                    <td>{p.name}</td>
                                    <td>
                                        {p.category?.id ?? p.category_id} — {p.category_name}
                                    </td>
                                    <td>{p.price ? `RM ${Number(p.price).toFixed(2)}` : "-"}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() =>
                                                alert(JSON.stringify(p, null, 2))
                                            }
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteOne(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {products?.data && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center gap-2">
                        <span>Show</span>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            Showing {products.from || 0} to {products.to || 0} of {products.total} entries
                        </div>
                        <nav aria-label="Product navigation">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {(() => {
                                    const totalPages = products.last_page;
                                    const current = currentPage;
                                    let pages = [];

                                    if (totalPages <= 7) {
                                        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                                    } else {
                                        if (current <= 3) {
                                            pages = [1, 2, 3, 4, '...', totalPages];
                                        } else if (current >= totalPages - 2) {
                                            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                        } else {
                                            pages = [1, '...', current - 1, current, current + 1, '...', totalPages];
                                        }
                                    }

                                    return pages.map((page, index) => (
                                        <li key={index} className={`page-item ${page === current ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => page !== '...' && setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ));
                                })()}
                                <li className={`page-item ${currentPage === products.last_page ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.min(products.last_page, prev + 1))}
                                        disabled={currentPage === products.last_page}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
            <NotificationContainer />
        </div>
    );
}
