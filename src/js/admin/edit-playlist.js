{
	let view = {
		el: '#eidtPlaylist'
	}

	let model = {
		data:{}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.bindEventHub()
		},
		bindEventHub(){
			window.eventHub.on('editAbled', (data) => {
				this.model.data = data
				console.log(this.model.data)
			})
		}
	}

	controller.init(view, model)
}