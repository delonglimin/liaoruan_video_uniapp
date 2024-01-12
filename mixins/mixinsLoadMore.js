/**
 * 使用
 * 	- 引入 import mixinsLoadMore from 'mixins/mixinsLoadMore.js'
 * 	- 混入 mixins: [mixinsLoadMore]
 * 	- 页面(因为参数，所以需要在页面单独引用) onLoad(){this.mixOnLoad()}
 *  - 页面data配置
 * 		- mixUrl接口地址
 * 		- requestData请求参数
 * 		- mixListKey 列表在data的某个key中
 * 		- isMapList 是否需要对数据进行变更
 *  - 页面methods方法
 * 		- mapRequestData 如果有需要对返回数据进行组织
 * 利用 <u-loadmore v-if="mixList.length>=mixPage.limit" :status="mixLoadStatus" />
 */

import http from '@/utils/vmeitime-http/interface.js'
export default {
	data() {
		return {
			mixPage: { // 分页数据
				pageNum: 1,
				pageSize: 20
			},
			mixLoadStatus: 'loadmore', // _loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			mixList:[], // 返回数据
			requestData: {}, // 请求参数
			mixUrl: 'xxx', // 请求接口地址
			mixListKey: '', // 列表在data的某个key中
			isMapList: false, // 是否对返回的数据进行组织
		}
	},
	
	// 下拉刷新
	onPullDownRefresh() {
		this.mixOnLoad()
		uni.stopPullDownRefresh()
	},
	// 上拉加载
	onReachBottom() {
		this.mixOnReachBottom()
	},
	
	methods: {
		// 初始化数据
		mixOnLoad(){
			this.mixList = []
			this.mixPage.pageNum = 0
			this.mixLoadStatus='loadmore'
			this.getDataList()
		},
		// 触底执行
		mixOnReachBottom(){
			if (this.mixLoadStatus!='loadmore') return
			this.mixPage.pageNum += this.mixPage.pageSize
			this.getDataList()
		},

		// 获取数据列表
		getDataList(){
			if (this.mixLoadStatus!='loadmore') return

			this.mixLoadStatus = 'loading'
			http.post(this.mixUrl, {
				...this.mixPage,
				...this.requestData
			}).then(res=>{
				let list = []
				if (this.mixListKey) {
					list = res.data[this.mixListKey]
				} else {
					list = res.data
				}
				// 有需要对返回的数据进行重新组织
				if (this.isMapList) {
					list = this.mapRequestData(list)
				}
				// 赋值列表
				this.mixList = this.mixList.concat(list)
				// 判断是否有下一页
				if (res.data.count > this.mixList.length) {
					this.mixLoadStatus = 'loadmore'
				} else {
					this.mixLoadStatus = 'nomore'
				}
			}).catch(err => {
				this.mixLoadStatus = 'loadmore'
			}).finally(()=>{})
		}

	}
}
