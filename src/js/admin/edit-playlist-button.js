{
	let view = {
		el: '.edit-playlist-dialog',
		remove(){
			$(this.el).remove()
		}
	}

	let model = {
		data:{},
		save(){
		    var todo = AV.Object.createWithoutData('Playlist', this.data.id);
		    todo.set('name', this.data.name);
		    todo.set('cover', this.data.cover);
		    return todo.save().then((result) => {
		    	return result;
		    })
		}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.getModelData()
			this.bindEvents()
			this.validateForm()
		},
		bindEvents(){
			$(this.view.el).on('click', '#savePlaylist', (e) => {
				let isValidate = Boolean($(this.view.el).find('.validate-tips').text())
				if(!isValidate){ // 验证是否通过
					let valueList = ['name', 'cover']
					valueList.map((key) => {
						this.model.data[key] = $(this.view.el).find(`input[name=${key}]`).val()
					})
					this.model.save().then((result) => {
						window.eventHub.emit('updatePlaylist', this.model.data)
						this.view.remove()
					})
				}
			})
			$(this.view.el).on('click', '#canclePlaylist', (e) => {
				this.view.remove()
			})
		},
		getModelData(){
			let keyList = ['id', 'name', 'cover']
			keyList.map((key) => {
				this.model.data[key] = $(this.view.el).find(`input[name=${key}]`).val()
			})
		},
		validateForm(){
			$(this.view.el).find('#playlistName').on('blur', (e) => {
				let value = $(e.currentTarget).val()
				if(!value){
					$(e.currentTarget).parent().siblings('.validate-tips').text('请输入歌单名')
				}else{
					$(e.currentTarget).parent().siblings('.validate-tips').text('')
				}
			})

			$(this.view.el).find('#playlistCover').on('blur', (e) => {
				let value = $(e.currentTarget).val()
				if(!value){
					$(e.currentTarget).parent().siblings('.validate-tips').text('请输入歌单封面链接')
				}else{
					$(e.currentTarget).parent().siblings('.validate-tips').text('')
				}
			})
		}
	}

	controller.init(view, model)
}