import axios from '../../utils/axios'

export default {
    getRunLog(data) {
        return axios.post('process/behaviorInfo_query', data)
    },
    deleteRunLog(data) {
        return axios.post('process/beahavior_dele', data)
    }
}