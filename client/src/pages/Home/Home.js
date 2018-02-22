import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { List, ListItem } from "../../components/List";
import { Link } from "react-router-dom";
import DeleteBtn from "../../components/DeleteBtn";
import { Input, TextArea, FormBtn } from "../../components/Form";
import SaveBtn from "../../components/SaveBtn";

class Home extends React.Component {
  state = {
    articles: [],
    savedArticles: [],
    keyword: "",
    startDate: "",
    endDate: "",
    queryURL: "https://api.nytimes.com/svc/search/v2/articlesearch.json"

  };

  componentDidMount() {
    this.loadSavedArticles();
  }

  loadSavedArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ savedArticles: res.data })
      )
      .catch(err => console.log(err));
  };

  loadArticles = (res) => {
    this.setState({ articles: res.data.response.docs })
  };

  saveArticle = (_id) => {
    let article = this.state.articles.filter(article => article._id === _id);
    console.log(article[0]);
    API.saveArticle({title:  article[0].headline.main,
      url: article[0].web_url,
      note: "have not implemented note",
      _id: _id
    })
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
    this.loadSavedArticles();
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    let params = {
      'api-key': "02ed5026ddea4edeb44e54a9f864ce1e",
      q: this.state.keyword
    }
    if(this.state.startDate !== ""){
      params.begin_date = this.state.startDate;
    }
    if(this.state.endDate !== ""){
      params.end_date = this.state.endDate
    }
    if (this.state.keyword) {
      API.populateArticles(this.state.queryURL, { params })
        .then(res => {
          console.log(res.data.response.docs)
          this.loadArticles(res)
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>New York Times Article Search</h1>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h3>Search</h3>
              <form>
                <Row>
									<Col size="sm-12">
										<Input
                      value={this.state.keyword}
                      onChange={this.handleInputChange}
                      name="keyword"
                      placeholder="Keyword (required)"
                    />
									</Col>
								</Row>
                <br></br>
                <Row>
                  <Col size="sm-4 xs-6">
                    <Input
                      value={this.state.startDate}
                      onChange={this.handleInputChange}
                      name="startDate"
                      placeholder="Start Date (YYYY-MM-DD)"
                    />
										{/* <div className="form-group">
											<div className='input-group date' id='startDate'>
												<span className="input-group-addon" id="basic-addon1">Start Date: </span>
												<input type='text' className="form-control" />
												<span className="input-group-addon">
													<span className="glyphicon glyphicon-calendar">
													</span>
												</span>
											</div>
										</div> */}
									</Col>
                  <Col size="sm-4 xs-6">
                    <Input
                      value={this.state.endDate}
                      onChange={this.handleInputChange}
                      name="endDate"
                      placeholder="End Date (YYYY-MM-DD)"
                    />
										{/* <div class="form-group">
											<div class='input-group date' id='endDate'>
												<span class="input-group-addon" id="basic-addon1">End Date: </span>
												<input type='text' class="form-control" />
												<span class="input-group-addon">
													<span class="glyphicon glyphicon-calendar">
													</span>
												</span>
											</div>
										</div> */}
									</Col>
                </Row>
                <Row>
									<Col size="sm-12" className="text-center">
										<br></br>
										<FormBtn onClick={this.handleFormSubmit}>
                      Get Articles
                    </FormBtn>
									</Col>
								</Row>
              </form>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <div className="panel panel-default">
              <div className="panel-heading">NYT Articles</div>
              <div className="panel-body">
                <List>
                  {this.state.articles.map(article => (
                    <ListItem key={article._id}>
                      <Link to={article.web_url}>
                        <strong>
                          {article.headline.main}
                        </strong>
                      </Link>
                      <SaveBtn onClick={() => this.saveArticle(article._id)} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div> 
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <div className="panel panel-default">
              <div className="panel-heading">NYT Articles</div>
              <div className="panel-body">
                <List>
                  {this.state.savedArticles.map(article => (
                    <ListItem key={article._id}>
                      <Link to={"/articles/" + article._id}>
                        <strong>
                          {article.title} by {article.author}
                        </strong>
                      </Link>
                      <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;

// <form>
//               <Input
//                 value={this.state.author}
//                 onChange={this.handleInputChange}
//                 name="author"
//                 placeholder="Author (required)"
//               />
//               <TextArea
//                 value={this.state.synopsis}
//                 onChange={this.handleInputChange}
//                 name="synopsis"
//                 placeholder="Synopsis (Optional)"
//               />
//               <FormBtn
//                 disabled={!(this.state.author && this.state.title)}
//                 onClick={this.handleFormSubmit}
//               >
//                 Submit Book
//               </FormBtn>
//             </form>

// <form role="form">
// 								<Row>
									

// 									<div class="col-sm-4">
// 										<div class="btn-group" id="sortBy">
// 											<button class="btn btn-default" id="sortText">
// 											Sort
// 											</button>
// 											<button data-toggle="dropdown" class="btn btn-default dropdown-toggle">
// 											<span class="caret"></span>
// 											</button>
// 											<ul class="dropdown-menu">
// 												<li>
// 													<a href="#" value="oldest">Oldest to Newest</a>
// 												</li>
// 												<li>
// 													<a href="#" value="newest">Newest to Oldest</a>
// 												</li>
// 											</ul>
// 										</div>
// 									</div>
// 								</Row>

// 							</form>