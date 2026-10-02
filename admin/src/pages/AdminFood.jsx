import FoodManagement from "../components/admin/FoodManagement";
import { API_BASE_URL } from "../config/api";

function AdminFood() {
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto max-w-7xl px-6">
                <FoodManagement apiUrl={API_BASE_URL} />
            </div>
        </div>
    );
}

export default AdminFood;
