import request from '../request'

export default {
	upload(data = {}, config = {}) {
		return request.post('/meat_ganoderma/upload', data, { loading: true, ...config })
	},
	agreementList(data = {}, config = {}) {
		return request.post('/meat_ganoderma/list', data, { ...config })
	},
	scan(data = {}, config = {}) {
		return request.post('/meat_ganoderma/scanned', data, { loading: true, ...config })
	},
	scanList(data = {}, config = {}) {
		return request.post('/meat_ganoderma/scanned_list', data, { ...config })
	},
	strainList(data = {}, config = {}) {
		return request.post('/meat_ganoderma/strains_list', data, { ...config })
	},
	growLog(data = {}, config = {}) {
		return request.post('/meat_ganoderma/strains_picture_list', data, { ...config })
	},
	growUpload(data = {}, config = {}) {
		return request.post('/meat_ganoderma/strains_upload', data, { loading: true, ...config })
	},
}