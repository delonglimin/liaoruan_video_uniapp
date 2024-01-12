export default {
	// 权限信息
	getToken() {
		return uni.getStorageSync('token')
	},
	setToken(token) {
		uni.setStorageSync('token', token)
	},
	getKey() {
		return uni.getStorageSync('key')
	},
	setKey(key) {
		uni.setStorageSync('key', key)
	},
	getUser() {
		return uni.getStorageSync('User')
	},
	setUser(User) {
		uni.setStorageSync('User', User)
	},

	clearAll() {
		uni.clearStorage()
	}
}
