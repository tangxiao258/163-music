{
	let view = {
		el: '.new-playlist-dialog',
		remove(){
			$(this.el).remove()
		}
	}

	let model = {
		data:{name: '', cover: ''},
		new(){
			var Playlist = AV.Object.extend('Playlist');
			var playlist = new Playlist();
			playlist.set('name',this.data.name);
			playlist.set('cover', this.data.cover);
			return playlist.save().then((result) => {
			  	return result;
			});
		}
	}

	let controller ={
		init(view, model){
			this.view = view
			this.model = model
			this.bindEvents()
			this.validateForm()
		},
		bindEvents(){
			$(this.view.el).on('click', '#createPlaylist',(e) => {
				let isValidate = Boolean($(this.view.el).find('.validate-tips').text())
				if(!isValidate){ // 验证是否通过
					let valueList = ['name', 'cover']
					valueList.map((key) => {
						this.model.data[key] = $(this.view.el).find(`input[name=${key}]`).val()
					})
					this.model.new().then((result) => {
						window.eventHub.emit('newPlaylist', this.model.data)
						this.view.remove()
					})
				}
			})

			$(this.view.el).on('click', '#canclePlaylist', (e) => {
				this.view.remove()
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