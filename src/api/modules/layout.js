import axios from '../../utils/axios'

export default {
    save(datas) {
        return axios.post('statistical/browsing/save', datas)
    }
}