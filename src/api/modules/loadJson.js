import axios from '../../utils/axios'

export default {
    loadGeoJson(url) {
        return axios.get(url)
    },
    getProjectDocInfo(data) {
        return axios.post('project/buildingDocInfo_query', data)
    }
}