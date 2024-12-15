import { doctorService } from "../services/doctorService"

const getTopDoctorHome = async (req, res) => {
    try {
        let limit = req.query.limit // Chuyển đổi limit về số nguyên
        if (isNaN(limit) || limit <= 0) limit = 10; // Đảm bảo giá trị mặc định

        console.log('🚀 ~ getTopDoctorHome ~ limit:', limit);

        const response = await doctorService.getTopDoctorHome(+limit); // Gọi đến service
        if (!response) {
            return res.status(404).json({ status: 'ERR', message: 'No data found' });
        }

        res.status(200).json(response); // Trả về phản hồi JSON
    } catch (error) {
        console.error('Error in getTopDoctorHome:', error); // Log lỗi
        return res.status(500).json({ status: 'ERR', message: error.message || 'Internal Server Error' });
    }
};


export const doctorController = {
    getTopDoctorHome
}