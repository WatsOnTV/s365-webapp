<!--
    File................homepage.vue
    Author..............<redacted for assignment>
    Date................May 2020

    Homepage.vue is created with the idea of a single page website, with heavy use of bootstrap modals.
 -->
<template>
  <div id="petitions">
    <div id="site_title">Petition Site</div>
    <div id="page_title">Home Page</div>
    <div id="log_in_out">
      <span v-if="isLoggedIn()">
        Welcome, {{ this.logged_in_user.name }}!
        <br />
        <button class="common_button" v-on:click="logoutUser()">
          Logout
        </button>
        <button class="common_button" v-on:click="user_edit_toggle = false" data-toggle="modal"
                data-target="#userProfileModal">
          View my Profile
        </button>
        <button class="common_button" v-if="!user_petitions_only" v-on:click="viewUserPetitions()">
          View my Petitions
        </button>
        <button class="common_button" v-else v-on:click="viewUserPetitions()">View all Petitions</button>
        <button class="common_button" data-toggle="modal" data-target="#createPetitionModal" id="create_petition_button">Create New Petition</button>
      </span>
    <span v-else>
        <button class="common_button" data-toggle="modal" data-target="#loginModal">Login</button>
        <button class="common_button" data-toggle="modal" data-target="#registerModal">Register</button>
      </span>
  </div>
    <button class="common_button" id="adv_search_button" type="button" data-toggle="modal" data-target="#filterPetitionsModal">
      Advanced Search
    </button>



    <br/><br/>
    <div v-if="user_petitions_only" id="view_own_petitions_instructions">
      <br />
      <strong>To return to viewing all petitions, click "View all Petitions" under "View my Profile".</strong>
    </div>
    <div id="petitions_table" v-if="num_petitions !== 0">
      <div id="petition_instructions">
        To sort by title or signature, click the relevant header. Click on a petition for more.
      </div>
      <table>
        <tr id="petition_table_titles">
          <td class="petition_table_title">
            <button class="petition_table_button" v-on:click="sortPetitionsByTitle()">
              <strong class="table_title">Title</strong>
              <span v-if="queries.sortBy === 'ALPHABETICAL_ASC'">
                <svg class="bi bi-arrow-up" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8 3.707 5.354 6.354a.5.5 0 11-.708-.708l3-3z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else-if="queries.sortBy === 'ALPHABETICAL_DESC'">
                <svg class="bi bi-arrow-down" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4.646 9.646a.5.5 0 01.708 0L8 12.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M8 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V3a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else>
                <svg class="bi bi-arrow-up-down" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M11 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M10.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L11 3.707 8.354 6.354a.5.5 0 11-.708-.708l3-3zm-9 7a.5.5 0 01.708 0L5 12.293l2.646-2.647a.5.5 0 11.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M5 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V3a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                </svg>
              </span>
            </button>
          </td>
          <td class="petition_table_title"><strong>Category</strong></td>
          <td class="petition_table_title"><strong>Author</strong></td>
          <td class="petition_table_title">
            <button class="petition_table_button" v-on:click="sortPetitionsBySignatures()">
              <strong class="table_title">Signatures</strong>
              <span v-if="queries.sortBy === 'SIGNATURES_ASC'">
                <svg class="bi bi-arrow-up" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8 3.707 5.354 6.354a.5.5 0 11-.708-.708l3-3z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else-if="queries.sortBy ==='SIGNATURES_DESC'">
                <svg class="bi bi-arrow-down" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4.646 9.646a.5.5 0 01.708 0L8 12.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M8 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V3a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else>
                <svg class="bi bi-arrow-up-down" width="1vw" height="1vw" viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M11 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M10.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L11 3.707 8.354 6.354a.5.5 0 11-.708-.708l3-3zm-9 7a.5.5 0 01.708 0L5 12.293l2.646-2.647a.5.5 0 11.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M5 2.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V3a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                </svg>
              </span>
            </button>
          </td>
          <td class="petition_table_title"><strong>Hero Image</strong></td>
        </tr>
        <tr v-for="petition in petitions" v-on:click="seeMoreOfPetition(petition)" class="petition_table_entry">
          <td>{{ petition.title }}</td>
          <td>{{ petition.category }}</td>
          <td><img :id="'user_profile_img_' + petition.authorId" :src="'http://localhost:4941/api/v1/users/' + petition.authorId + '/photo'"
                   @error="setDefaultImg(petition.authorId, null)" style="max-width: 5vw;"/> <br />{{ petition.authorName }}</td>
          <td>{{ petition.signatureCount }}</td>
          <td><img v-bind:src="`http://localhost:4941/api/v1/petitions/${petition.petitionId}/photo`"
                   v-bind:id="'hero_petition_' + petition.petitionId" v-bind:alt="'hero_petition_' + petition.petitionId"
                   style="max-width: 15vw; float: right;"  /></td>
        </tr>
      </table>
      <br/>
      <button id="back_start" v-on:click="paginatePetitions(0)">
        <span v-if="current_page === 1">
          <svg class="bi bi-chevron-double-left" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 010 .708L2.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 010 .708L6.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span v-else>
          <svg class="bi bi-chevron-double-left" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 010 .708L2.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 010 .708L6.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
          </svg>
        </span>
      </button>
      <button id="back_page" v-on:click="paginatePetitions(1)">
        <span v-if="current_page === 1">
          <svg class="bi bi-chevron-left" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span v-else>
          <svg class="bi bi-chevron-left" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
          </svg>
        </span>
      </button>
      <span id="current_page_info">
        Page: {{ current_page }} / {{ Math.ceil(total_petitions / this.queries.count) }}
      </span>
      <button id="forward_page" v-on:click="paginatePetitions(2)">
        <span v-if="current_page === Math.ceil(total_petitions / this.queries.count)">
          <svg class="bi bi-chevron-right" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span v-else>
          <svg class="bi bi-chevron-right" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
        </span>
      </button>
      <button id="forward_last" v-on:click="paginatePetitions(3)">
        <span v-if="current_page === Math.ceil(total_petitions / this.queries.count)">
          <svg class="bi bi-chevron-double-right" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span v-else>
          <svg class="bi bi-chevron-double-right" width="2em" height="2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
        </span>
      </button>
      <br />
      <br />
      <label for="petitions_per_page_selectbox">Petitions per Page</label>
      <select id="petitions_per_page_selectbox" v-on:change="paginateSelect()">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
    <div v-else id="no_petitions">
      <span>Sorry, no results returned.<br />Try filtering for something else.</span>
    </div>

    <!--------------------------- Modal Definitions --------------------------->
    <div>
      <div class="modal fade" id="filterPetitionsModal" tabindex="-1" role="dialog"
           aria-labelledby="filterPetitionsModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" id="deleteUserModalLabel">Filter Petitions</h2>
            </div>
            <div class="modal-body">
              <div id="search_filter">
                <label for="search_inputbox">Search Keywords:</label>
                <input type="text" id="search_inputbox"/>
                <span>Optional</span>
              </div>
              <br/>
              <div id="category_filter">
                <label for="category_selectbox">Category:</label>
                <select id="category_selectbox">
                  <option value="0">None</option>
                  <option v-for="category in categories" v-bind:value="category.categoryId">{{ category.name }}</option>
                </select>
                <span>Optional</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"
                      v-on:click="setFilters()">
                Apply Filters
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal"
                      v-on:click="clearFilters()">
                Clear Filters
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="seeMoreOfPetitionModal" tabindex="-1" role="dialog"
           aria-labelledby="filterPetitionsModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" id="seeMoreOfPetitionModalLabel">{{ maximised_petition.title }}</h2>
            </div>
            <div class="modal-body">
              <img v-bind:src="`http://localhost:4941/api/v1/petitions/${maximised_petition.petitionId}/photo`"
                   v-bind:id="'hero_petition_' + maximised_petition.petitionId" v-bind:alt="'hero_petition_' + maximised_petition.petitionId"
                   style="max-width: 15vw; float: right;"  />
              <label>Category:</label> {{ maximised_petition.category }}
              <div id="petitionDescContainter">
                <label for="petitionDescription">Petition Description:</label>

                <span class="modal-subtitle" id="petitionDescription">{{ maximised_petition.description }}</span>
                <br/><br/>
                <span v-if="maximised_petition.createdDate">
                  <!-- Does not compile without the if... -->
                  Petition created on {{ changeDate(maximised_petition.createdDate) }}
                </span>
                <br/>
                <span v-if="maximised_petition.closingDate">
                  <span v-if="datePassed(maximised_petition.closingDate)">
                    Petition closed on {{ changeDate(maximised_petition.closingDate) }}
                  </span>
                  <span v-else>
                  Petition closes on {{ changeDate(maximised_petition.closingDate) }}
                  </span>
                </span>
                <span v-else>
                  Petition has no closing date.
                </span>
              </div>
              <br/>
              <div id="petitionSignatures">
                <span v-if="maximised_petition.signatureCount === 1">
                  This petition has been signed by 1 user.
                </span>
                <span v-else>
                  This petition has been signed by {{maximised_petition.signatureCount}} users.
                </span>
                <span v-if="maximised_petition.signatureCount">
                  <button v-if="maximised_petition.signatureCount !== 0 && !signaturesAreShowing" type="button"
                          id="showSignatoriesButton" v-on:click="signaturesAreShowing = !signaturesAreShowing">
                    View Signatories
                  </button>
                  <button v-if="maximised_petition.signatureCount !== 0 && signaturesAreShowing" type="button"
                          id="hideSignatoriesButton" v-on:click="signaturesAreShowing = !signaturesAreShowing">
                    Hide Signatories
                  </button>
                </span>
                <br v-if="maximised_petition.signatureCount !== 0 && signaturesAreShowing"/>
                <table v-if="maximised_petition.signatureCount !== 0 && signaturesAreShowing">
                  <tr v-for="signature in petitionSignatures" v-bind:id="'signature_user_'+signature.signatoryId">
                    <td><img :id="'signature_profile_img_' + signature.signatoryId" :src="'http://localhost:4941/api/v1/users/' + signature.signatoryId + '/photo'"
                             @error="setDefaultImg(signature.signatoryId, 'signature_profile_img_' + signature.signatoryId)" style="max-width: 3vw;"/>
                    {{ signature.name }}
                      signed on {{ changeDate(signature.signedDate) }}</td>
                  </tr>
                </table>
              </div>
              <hr/>
              <div id="petitionAuthor">
                <label>About the Author</label>
                <br/>
                <span>
                  {{ getAuthorData() }}
                  <br />
                  <img :id="'author_petition_img_' + maximised_petition.authorId" :src="'http://localhost:4941/api/v1/users/' +
                       maximised_petition.authorId + '/photo'" @error="setDefaultImg(maximised_petition.authorId,
                       'author_petition_img_' + maximised_petition.authorId)" style="max-width: 5vw;"/>
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <span v-if="!isUserAuthor()">
                <button v-if="isLoggedIn() && !user_has_signed && !datePassed(maximised_petition.closingDate)"
                        type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="signPetition(null)">
                  Sign Petition
                </button>
                <button v-else-if="isLoggedIn() && user_has_signed && !datePassed(maximised_petition.closingDate)"
                        type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="unsignPetition()">
                  Remove Signature
                </button>
                <button v-else-if="!isLoggedIn()"
                        type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#loginModal">
                  Login to Sign this Petition
                </button>
              </span>
              <span v-else>
                <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="confirmDelete()">
                  Delete Petition
                </button>
                <button v-if="!datePassed(maximised_petition.closingDate)" type="button" class="btn btn-primary" data-dismiss="modal"
                        v-on:click="openEditModal()">
                  Edit Petition
                </button>
              </span>
              <button type="button" class="btn btn-secondary" data-dismiss="modal"
                      v-on:click="signaturesAreShowing=false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="editPetitionModal" tabindex="-1" role="dialog"
           aria-labelledby="editPetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">Editing: {{ this.maximised_petition.title }}</h2>
              <span>All fields are optional. Unsupplied fields will not be changed.</span>
            </div>
            <div class="modal-body">
              <form>
                <label for="edit_petition_title_inputbox">Title: </label>
                <textarea id="edit_petition_title_inputbox"
                          style="resize: none" />
                <br />
                <label for="edit_petition_desc_inputbox">Description: </label>
                <textarea id="edit_petition_desc_inputbox"
                          style="resize: none" />
                <br />
                <label for="edit_petition_category_selectbox">Category: </label>
                <select id="edit_petition_category_selectbox">
                  <option value="0"/>
                  <option v-for="category in categories" v-bind:value="category.categoryId">{{ category.name }}</option>
                </select>
                <br />
                <label for="edit_petition_closing_date">Closing Date: </label>
                <input id="edit_petition_closing_date" type="datetime-local" v-bind:value="maximised_petition.closingDate">
                <br />
                <label for="edit_petition_image">Select a Petition Image: </label>
                <input id="edit_petition_image" type="file" accept="image/gif,image/jpg,image/png,image/jpeg" />
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" data-dismiss="modal" v-on:click="confirmEdit(confirmation_modal_args)">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="informationalModal" tabindex="-1" role="dialog"
           aria-labelledby="informationalModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">{{ informational_modal_title }}</h2>
            </div>
            <div class="modal-body">
              <span v-html="informational_modal_data" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog"
           aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">{{ confirmation_modal_title }}</h2>
            </div>
            <div class="modal-body">
              <span v-html="confirmation_modal_data" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" data-dismiss="modal" v-on:click="confirmation_modal_function()">Confirm</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="createPetitionModal" tabindex="-1" role="dialog"
           aria-labelledby="createPetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">Create a New Petition</h2>
            </div>
            <div class="modal-body">
              <form>
                <label for="create_petition_title_inputbox">Petition Title: </label>
                <textarea id="create_petition_title_inputbox" style="resize: none"/>
                <br />
                <label for="create_petition_description_inputbox">Description: </label>
                <textarea id="create_petition_description_inputbox" style="resize: none" />
                <br />
                <label for="create_petition_category">Category: </label>
                <select id="create_petition_category">
                  <option value="0" selected disabled>Please Select...</option>
                  <option v-for="category in categories" v-bind:value="category.categoryId">{{ category.name }}</option>
                </select>
                <br />
                <label for="create_petition_closing_date">Closing Date: </label>
                <input id="create_petition_closing_date" type="datetime-local" />
                <span>If left blank, the petition will never close</span>
                <br />
                <label for="create_petition_image">Petition Hero Image: </label>
                <input type="file" id="create_petition_image" accept="image/gif,image/png,image/jpg,image/jpeg"/>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" data-dismiss="modal" v-on:dblclick="confirmCreate()"
                      v-on:click="confirmCreate()">Create Petition</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="loginModal" tabindex="-1" role="dialog"
           aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1>Login to your Account</h1>
            </div>
            <div class="modal-body">
              <form id="login_form">
                <label for="login_email_inputbox">Email:</label>
                <input id="login_email_inputbox" type="text" placeholder="email@example.com" />
                <br />
                <label for="login_password_inputbox">Password:</label>
                <input id="login_password_inputbox" type="password" placeholder="Password" />
                <br />
              </form>
            </div>
            <div class="modal-footer">
              <button type="submit" form="login_form" class="btn btn-primary" data-dismiss="modal" v-on:click="validateLogin()">Login</button>
              <button type="reset" class="btn btn-secondary" data-dismiss="modal" form="login_form">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="registerModal" tabindex="-1" role="dialog"
           aria-labelledby="registerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1>Register for an Account</h1>
            </div>
            <div class="modal-body">
              <form id="register-form">
                <label for="register_name_inputbox">Name:</label>
                <input type="text" id="register_name_inputbox" placeholder="Joe Bloggs"/>
                <span v-if="errors.includes('NameEmpty')" style="color: #ff0000">*</span>
                <br />

                <label for="register_email_inputbox">Email Address:</label>
                <input type="text" id="register_email_inputbox" placeholder="email@example.com"/>
                <br />

                <label for="register_country_inputbox">Country:</label>
                <input type="text" id="register_country_inputbox" placeholder="New Zealand"/>
                <br />

                <label for="register_city_inputbox">City:</label>
                <input type="text" id="register_city_inputbox" placeholder="Christchurch"/>
                <br />

                <label for="register_password_inputbox">Password:</label>
                <input type="password" id="register_password_inputbox" placeholder="Password"/>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="validateRegistration()">Register</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="userProfileModal" tabindex="-1" role="dialog"
           aria-labelledby="userProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1>User Profile: {{ logged_in_user.name }}</h1>
              <p>Here is where you can view or change your details.</p>
            </div>
            <div class="modal-body">
              <div v-if="!user_edit_toggle">
                <!-- User is just viewing their data -->
                <label>Name: </label>
                {{ logged_in_user.name }}
                <br />
                <label>Email: </label>
                {{ logged_in_user.email }}
                <div v-if="logged_in_user.city && logged_in_user.country">
                  <label>Location: </label>
                  {{ logged_in_user.city }}, {{ logged_in_user.country}}
                </div>
                <div v-else-if="logged_in_user.city">
                  <label>Location: </label>
                  {{ logged_in_user.city }}
                </div>
                <div v-else-if="logged_in_user.country">
                  <label>Location: </label>
                  {{ logged_in_user.city }}
                </div>
                <div v-else>
                  <label>Location: </label>
                  Not Supplied
                </div>
                <label>Profile Image</label>
                <img id="logged_in_user_img" :src="'http://localhost:4941/api/v1/users/' + logged_in_user.userId + '/photo'"
                     @error="setDefaultImg(logged_in_user.userId, 'logged_in_user_img')" style="max-width: 5vw;"
                     :alt="logged_in_user.name"/>
              </div>
              <div v-else>
                <!-- User has selected to edit their data -->
                <span><strong>Tip:</strong> If you do not want to edit a particular detail, leave the box blank.</span>
                <form autocomplete="off">
                  <label for="user_edit_name">Name: </label>
                  <input id="user_edit_name" />
                  <br />
                  <label for="user_edit_email">Email: </label>
                  <input id="user_edit_email" type="email" />
                  <br />
                  <label for="user_edit_city">City: </label>
                  <input id="user_edit_city" />
                  <br />
                  <label for="user_edit_country">Country: </label>
                  <input id="user_edit_country" />
                  <br />
                  <label for="user_edit_password">Password: </label>
                  <input @input="setUserEditPasswordIsBlank()" id="user_edit_password" type="password" autocomplete="new-password"/>
                  <br />
                  <span v-if="!userEditPasswordIsBlank">
                    It looks like you're trying to change your password! Please also enter your current password below.
                    <br />
                    <label for="edit_user_current_password">Current Password: </label>
                    <input type="password" id="edit_user_current_password" />
                    <br />
                  </span>
                  <label>Profile Image: </label>
                  <input id="user_edit_image" type="file" accept="image/gif, image/jpg, image/png">
                  <label>Delete Profile Photo: </label>
                  <br/>
                  <input id="edit_user_image_delete" type="checkbox">
                  <label for="edit_user_image_delete" style="font-weight: normal">Remove my current photo</label>
                </form>
              </div>
            </div>
            <div class="modal-footer">
              <span v-if="user_edit_toggle">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="editUserValidate()">Submit</button>
              </span>
              <span v-else>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
              </span>
              <button v-if="user_edit_toggle" v-on:click="user_edit_toggle = !user_edit_toggle"
                      style="float: left;" class="btn btn-secondary">
                Switch to View Data
              </button>
              <button v-else @click="() => {this.user_edit_toggle = !this.user_edit_toggle;
                                            this.userEditPasswordIsBlank = true;}"
                      class="btn btn-secondary" style="float: left;">
                Switch to Edit Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        petitions: [],
        //This is paginated
        num_petitions: 0,
        //This is total
        total_petitions: 0,
        maximised_petition: {},
        petitionSignatures: [],
        informational_modal_data: '',
        informational_modal_title: '',
        confirmation_modal_title: '',
        confirmation_modal_data: '',
        confirmation_modal_function: function(){},
        confirmation_modal_args: [],
        signaturesAreShowing: false,
        user_petitions_only: false,
        user_has_signed: false,
        checked: false,
        user_edit_toggle: false,
        validation_errors: '',
        temp_counter: 0,
        errors: [],
        user_token: '',
        categories: [],
        current_page: 1,
        logged_in_user: {},
        userEditPasswordIsBlank: true,
        queries: {
          // Can be ALPHABETICAL_ASC (default), ALPHABETICAL_DESC, SIGNATURES_ASC or SIGNATURES_DESC
          sortBy: "ALPHABETICAL_ASC",
          q: null,
          categoryId: null,
          authorId: null,
          // Get default 10 entries per page
          count: 10,
          // Start at petition 0
          startIndex: 0
        }
      }
    },

    mounted: function () {
      if(this.isLoggedIn()){
        this.user = this.getLoggedInUser();
      }
      this.getPetitions();
      this.getCategories();
    },

    methods: {

      /** Returns the currently logged in user */
      getLoggedInUser: function(){
        let userId = this.$session.get("userId");
        let userToken = this.$session.get("authToken");
        this.$http.get('http://localhost:4941/api/v1/users/' + userId, {
          headers: {
            "x-authorization": userToken
          }
        }).then((res) => {
          this.logged_in_user = res.data;
          this.logged_in_user.userId = userId;
        });
      },

      /** Gets petitions and filters and searches by the given queries */
      getPetitions: function () {
        let query = '?sortBy=' + this.queries.sortBy + '&';
        if (this.queries.q) {
          query += 'q=' + this.queries.q + '&';
        }
        if (this.queries.categoryId) {
          query += 'categoryId=' + this.queries.categoryId + '&';
        }
        if (this.queries.authorId) {
          query += 'authorId=' + this.queries.authorId + '&';
        }

        // Remove the trailing '&'
        query = query.slice(0, -1);

        // Get total number of petitions when queries applied (except startIndex)
        this.$http.get('http://localhost:4941/api/v1/petitions' + query).then((response) => {
          this.total_petitions = response.data.length;
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });

        query += '&count=' + this.queries.count + '&';
        query += 'startIndex=' + this.queries.startIndex;

        this.$http.get('http://localhost:4941/api/v1/petitions' + query).then((response) => {
          this.petitions = response.data;
          this.num_petitions = this.petitions.length;
          for(let i=0; i< this.num_petitions; i++) {
            this.$http.get('http://localhost:4941/api/v1/petitions/' + this.petitions[i].petitionId).then((response) => {
              this.maximised_petition = response.data;
              this.petitions[i].authorId = this.maximised_petition.authorId;
            }).catch((err) => {
              if (err.response.status === 401) {
                // User Auth token was incorrect! Not logged in
                this.$session.remove('authToken');
                this.$session.remove("userId");
                this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
              } else {
                //Unknown error
                this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
              }
            });
          }

        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });

      },

      /** Sorts the petitions by title */
      sortPetitionsByTitle: function () {
        if (this.queries.sortBy === "ALPHABETICAL_ASC") {
          this.queries.sortBy = "ALPHABETICAL_DESC";
        } else {
          this.queries.sortBy = "ALPHABETICAL_ASC";
        }
        this.getPetitions();
      },

      /** Sorts the petitions by signature count */
      sortPetitionsBySignatures: function () {
        if (this.queries.sortBy === "SIGNATURES_ASC") {
          this.queries.sortBy = "SIGNATURES_DESC";
        } else {
          this.queries.sortBy = "SIGNATURES_ASC";
        }
        this.getPetitions();
      },

      /** Sets the authorId query to only return the logged in users petitions */
      viewUserPetitions: function(){
        if(this.user_petitions_only){
          //The user is trying to view all petitions
          this.queries.authorId = null;
        } else{
          //The user wants to view their petitions
          this.queries.authorId = this.logged_in_user.userId;
        }
        this.user_petitions_only = !this.user_petitions_only;
        this.getPetitions();
      },

      /** Gets all the available categories */
      getCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions/categories').then((response) => {
          this.categories = response.data;
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Runs all of the set filter functions, then updates petitions */
      setFilters: function () {
        this.setSearchFilter();
        this.setCategoryFilter();
        this.paginatePetitions(0); // "go back to beginning"
        this.getPetitions();
      },

      /** Grabs the search filter and applies it to the petitions */
      setSearchFilter: function () {
        let query = document.getElementById("search_inputbox").value;
        if (query === "") {
          // User has left the search box blank
          this.queries.q = null;
        } else {
          this.queries.q = query;
        }
      },

      /** Clears the current search and category filters */
      clearFilters: function () {
        document.getElementById("search_inputbox").value = "";
        document.getElementById("category_selectbox").selectedIndex = 0;
        this.setFilters();
      },

      /** Grabs the selected category filter and applies it to the petitions */
      setCategoryFilter: function () {
        let selected = document.getElementById("category_selectbox").value;
        if (selected === "0") {
          // User has selected "None"
          this.queries.categoryId = null;
        } else {
          this.queries.categoryId = selected;
        }
      },

      /** Opens a modal showing the user further information about a petition */
      seeMoreOfPetition: function (petition) {
        this.getPetition(petition.petitionId);
        $("#seeMoreOfPetitionModal").modal('show');
      },

      /** Retrieves all information about a petition to show a user */
      getPetition: function (petition_id) {
        this.signaturesAreShowing = false;
        this.$http.get('http://localhost:4941/api/v1/petitions/' + petition_id).then((response) => {
          // Join the two json arrays
          this.maximised_petition = response.data;
          this.$http.get(`http://localhost:4941/api/v1/petitions/${petition_id}/signatures`).then((response) => {
            // This took me 3 hours to get working...It's not ideal, but it'll do.
            this.petitionSignatures = response.data;
            this.user_has_signed = false;
            if(this.isLoggedIn()){
              for(let i=0; i<this.petitionSignatures.length; i++){
                if(this.petitionSignatures[i].signatoryId === this.logged_in_user.userId){
                  this.user_has_signed = true;
                }
              }
            }
          }).catch((err) => {
            if(err.response.status === 401){
              // User Auth token was incorrect! Not logged in
              this.$session.remove('authToken');
              this.$session.remove("userId");
              this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
            }else{
              //Unknown error
              this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
            }
          });
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Changes date from ISO to a readable format */
      changeDate: function (date) {
        //Split the date into date and time
        date = date.split('T');
        //Remove the milliseconds and the Z
        date[1] = date[1].slice(0, -5);
        date = date[0] + " at " + date[1];
        return date;
      },

      /** Gets the users name (required) and country, city if they are available */
      getAuthorData: function () {
        let data = this.maximised_petition.authorName + " from ";
        if (this.maximised_petition.authorCity && this.maximised_petition.authorCountry) {
          data += this.maximised_petition.authorCity + ', ' + this.maximised_petition.authorCountry;
        } else if (this.maximised_petition.authorCountry) {
          data += this.maximised_petition.authorCity;
        } else if (this.maximised_petition.authorCity) {
          data += this.maximised_petition.authorCountry;
        } else {
          return this.maximised_petition.authorName;
        }
        return data;
      },

      /** Paginates the petitions, btn is one of [0,1,2,3], depending on which was pressed */
      paginatePetitions: function (btn) {
        let num_per_page = this.queries.count;
        let num_pages = Math.ceil(this.total_petitions / num_per_page);
        let shouldGetPetitions = true;
        switch (btn) {
          case 0:
            // To the first page if not already there
            if (this.current_page > 1) {
              this.queries.startIndex = 0;
              this.current_page = 1;
            } else {
              shouldGetPetitions = false;
            }
            break;
          case 1:
            // Previous page if page is not 1
            if (this.current_page > 1) {
              this.current_page -= 1;
              this.queries.startIndex -= num_per_page;
            } else {
              shouldGetPetitions = false;
            }
            break;
          case 2:
            // Next page if page is not the last
            if (this.current_page < num_pages) {
              this.current_page += 1;
              this.queries.startIndex += num_per_page;
            } else {
              shouldGetPetitions = false;
            }
            break;
          case 3:
            // To the last page
            if (this.current_page === num_pages) {
              shouldGetPetitions = false;
            } else {
              this.current_page = num_pages;
              let startIndexCalc = this.total_petitions - (this.total_petitions % num_per_page) - this.queries.startIndex;
              if (startIndexCalc >= this.total_petitions) {
                startIndexCalc -= num_per_page;
              }
              this.queries.startIndex += startIndexCalc;
            }
            break;
        }
        if (shouldGetPetitions) {
          this.getPetitions();
        }
      },

      /** Changes the amount of petitions shown to the user */
      paginateSelect: function () {
        this.queries.count = parseInt(document.getElementById("petitions_per_page_selectbox").value);
        this.paginatePetitions(0); // aka "send to beginning"
        this.getPetitions();
      },

      /** Checks to see if the user has been given a token and it is stored in the Session Storage.
       * This does not check the token is correct, just that the token exists. That is for the backend to decide.*/
      isLoggedIn: function () {
        return this.$session.exists("authToken") && this.$session.exists("userId");
      },

      /** Clears the Session Storage with key "authToken", essentially logging out the user, and then refreshing */
      logoutUser: function() {
        let header = {
          "X-Authorization": this.$session.get("authToken")
        };
        this.$http.post("http://localhost:4941/api/v1/users/logout",{}, {
          headers: header
        }).then((res) => {
          this.$session.remove('authToken');
          this.$session.remove("userId");
          this.$router.go(0);
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.$router.go(0);
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Adds the users name to the list of signatories for the currently maximised petition or the given ID*/
      signPetition: function (petition_id) {
        if(petition_id === null){petition_id = this.maximised_petition.petitionId;}

        let header = {
          "X-Authorization": this.$session.get("authToken")
        };
        this.$http.post(`http://localhost:4941/api/v1/petitions/${petition_id}/signatures`, {}, {
          headers: header
        }).then((res) => {
          this.openInformationalModal(this.maximised_petition.title,this.maximised_petition.authorName +
            " thanks you for signing their petition!");
          this.getPetitions();
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Removes the users signature from the currently maximised petition */
      unsignPetition: function(){
        this.$http.delete(`http://localhost:4941/api/v1/petitions/${this.maximised_petition.petitionId}/signatures`, {
          headers: {
            "X-Authorization": this.$session.get("authToken")
          }
        }).then((res) => {
          this.openInformationalModal(this.maximised_petition.title, 'Your signature has successfully been removed' +
            ' from this petition.');
          this.getPetitions();
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Returns true if the logged in user is the author of the maximised petition */
      isUserAuthor:function(){
        return this.logged_in_user.userId === this.maximised_petition.authorId;
      },

      /** Returns true if the given date has already passed */
      datePassed: function (date) {
        if(date){
          // The extra 0 in the SQL DateTime format causes errors with Date.parse() so I just remove it
          date = date.slice(0, -2);
          date += 'Z';
          return Date.parse(date) < Date.now();
        }
      },

      /** Opens the informational modal with the given title and body */
      openInformationalModal: function(title, body) {
        this.informational_modal_title = title;
        this.informational_modal_data = body;
        $("#informationalModal").modal("show");
      },

      /** Opens the confirmation modal with the given title, body
       * On confirm will run the given function fn */
      openConfirmationModal: function(title, body, fn, args) {
        this.confirmation_modal_title = title;
        this.confirmation_modal_data = body;
        this.confirmation_modal_function = fn;
        this.confirmation_modal_args = args;
        $("#confirmationModal").modal("show");
      },

      /** Confirms the deletion process */
      confirmDelete: function() {
        this.openConfirmationModal(this.maximised_petition.title, "Please confirm you would like to <b>delete</b>" +
          " this petition. <b>This cannot be undone!</b>", this.deletePetition);
      },

      /** Deletes the currently maximised petition */
      deletePetition: function() {
        this.$http.delete(`http://localhost:4941/api/v1/petitions/${this.maximised_petition.petitionId}`, {
          headers: {
            "X-Authorization": this.$session.get("authToken")
          }
        }).then((res) => {
          this.getPetitions();
          this.openInformationalModal(this.maximised_petition.title, "This petition has been deleted.");
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        })
      },

      /** Validates and confirms the editing process */
      confirmEdit: function() {
        let data = {};
        let date = document.getElementById("edit_petition_closing_date").value;
        if(date !== "") {
          if (Date.parse(date) < Date.now()) {
            this.openInformationalModal("Error", "Sorry, you need to select a date in the future.");
            return;
          }
          data.closingDate = date;
        }
        let title = document.getElementById("edit_petition_title_inputbox").value;
        if (title !== "") {
          data.title = title;
        }
        let desc = document.getElementById("edit_petition_desc_inputbox").value;
        if (desc !== "") {
          data.description = desc;
        }
        let category = parseInt(document.getElementById("edit_petition_category_selectbox").value);
        if (category !== 0) {
          data.categoryId = category;
        }
        let image = document.getElementById("edit_petition_image");
        if (Object.keys(data).length === 0 && data.constructor === Object && image.value === "") {
          this.openInformationalModal('Error', "You did not supply any changes!");
          return;
        }
        this.openConfirmationModal("Edit petition: " + this.maximised_petition.title,
          "Would you like to save these changes?", this.editPetition, [data, image]);
      },

      /** Edits a petition with the given data */
      editPetition: function(args) {
        let data = args[0];
        let image = args[1];
        if(image.value !== ""){
          this.$http.put("http://localhost:4941/api/v1/petitions/" + this.maximised_petition.petitionId + "/photo",
            image.files[0],
            {
              headers: {
                "X-Authorization": this.$session.get("authToken"),
                "Content-Type": image.files[0].type
              }
            }
          ).then((res) => {
            if(flag){
              this.openInformationalModal('Success', 'Petition has been successfully edited.');
              this.getPetitions();
            }
          }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        })
        }
        if(Object.keys(data).length === 0 && data.constructor === Object){
          return;
        }
        this.$http.patch('http://localhost:4941/api/v1/petitions/' + this.maximised_petition.petitionId, data,{
          headers: {
            "X-Authorization": this.$session.get("authToken")
          }
        }).then((res) => {
          this.openInformationalModal('Success', 'Petition has been successfully edited.');
          this.getPetitions();
        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Opens the edit modal, similar to how confirmation modal works */
      openEditModal: function() {
        $("#editPetitionModal").modal("show");
      },

      /** Validates and Confirms the creation process */
      confirmCreate: function() {
        let title = document.getElementById("create_petition_title_inputbox").value;
        if(title === ""){
          this.openInformationalModal('Error', 'Sorry, you didn\'t supply a petition title!');
          return;
        }
        let desc = document.getElementById("create_petition_description_inputbox").value;
        if(desc === ""){
          this.openInformationalModal('Error', 'Sorry, you didn\'t supply a petition description!');
          return;
        }
        let categoryId = parseInt(document.getElementById("create_petition_category").value);
        if(categoryId === 0){
          this.openInformationalModal('Error', 'Sorry, you didn\'t supply a petition category!');
          return;
        }

        let image = document.getElementById("create_petition_image");
        if(image.value === ""){
          this.openInformationalModal('Error', 'Sorry, you didn\'t supply a petition hero image!');
          return;
        }
        this.openConfirmationModal("Create petition: " + title,
          "Please confirm you would like to publish this petition", this.createPetition);
      },

      /** Creates the petition */
      createPetition: function() {
        let data;
        let title = document.getElementById("create_petition_title_inputbox").value;
        let desc = document.getElementById("create_petition_description_inputbox").value;
        let categoryId = parseInt(document.getElementById("create_petition_category").value);
        let closingDate = document.getElementById("create_petition_closing_date").value;
        if(!closingDate || closingDate === ""){
          data = {
            title: title,
            description: desc,
            categoryId: categoryId,
          };
        } else{
          if(Date.parse(closingDate) < Date.now()){
            this.openInformationalModal('Error', 'Sorry, the closing date must be in the future!');
            return;
          }
          data = {
            title: title,
            description: desc,
            categoryId: categoryId,
            closingDate: closingDate
          };
        }
        let image = document.getElementById("create_petition_image");

        this.$http.post("http://localhost:4941/api/v1/petitions", data, {
          headers: {
            "X-Authorization": this.$session.get("authToken")
          }
        }).then((res) => {
          // Add the image
          this.$http.put("http://localhost:4941/api/v1/petitions/" + res.data.petitionId + "/photo",
            image.files[0], {
            headers: {
              "X-Authorization": this.$session.get("authToken"),
              "Content-Type": image.files[0].type
            }
          }).then((res) => {
            this.openInformationalModal('Success', 'Petition has been successfully created.');
            //TODO open max modal??
            this.getPetitions();
          }).catch((err) => {
            if(err.response.status === 401){
              // User Auth token was incorrect! Not logged in
              this.$session.remove('authToken');
              this.$session.remove("userId");
              this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
            }else{
              //Unknown error
              this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
            }
          });
          this.signPetition(res.data.petitionId);

        }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Check if valid credentials then try login */
      validateLogin: function() {
        let isEmail = document.getElementById("login_email_inputbox").value !== "";
        let isPassword = document.getElementById("login_password_inputbox").value !== "";
        if(isEmail && isPassword) {
          this.attemptLogin();
        }else{
          if(!isEmail){
            this.openInformationalModal('Error', "You did not supply any email to log in with!");
          } else if(!isPassword){
            this.openInformationalModal('Error', "You did not supply any password to log in with!");
          }
        }
      },

      /** Send a POST request to the API with the supplied credentials */
      attemptLogin: function() {
        this.$http.post('http://localhost:4941/api/v1/users/login', {
          email: document.getElementById("login_email_inputbox").value,
          password: document.getElementById("login_password_inputbox").value
        }).then((response) => {
          // User is logged in, save token to this.$session
          this.$session.set("authToken", response.data.token);
          this.$session.set("userId", response.data.userId);
          this.getLoggedInUser();
        }).catch((err) => {
          if(err.response.status === 400){
            this.openInformationalModal('Error logging in', "Sorry, either the email or password you supplied" +
              " was incorrect.");
          }else{
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Starts the validation process, calling the validation functions */
      validateRegistration: function(){
        let name = document.getElementById("register_name_inputbox").value;
        let email = document.getElementById("register_email_inputbox").value;
        let city = document.getElementById("register_city_inputbox").value;
        let country = document.getElementById("register_country_inputbox").value;
        let password = document.getElementById("register_password_inputbox").value;

        if(name === "") {
          this.openInformationalModal('Error', 'You did not supply a name!');
        }else if(email === "") {
          this.openInformationalModal('Error', 'You did not supply an email!');
        }else if(this.emailIsIncorrect("register_email_inputbox")) {
          this.openInformationalModal('Error', 'The email you supplied is not valid.');
        }else if(password === ""){
          this.openInformationalModal('Error', 'You did not supply a password!');
        }else{
          this.postUser(name, email, country, city, password);
        }
      },

      /** Returns true if the email is the incorrect format */
      emailIsIncorrect: function(elementId){
        // scary regex function :(
        // I have borrowed this function from StackOverflow user 'rnevius'.
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !re.test(String(document.getElementById(elementId).value).toLowerCase());
      },

      /** Sends a POST request to the server creating the user */
      postUser: function(name, email, country, city, password) {
        let user = {
          name: name,
          email: email,
          country: country,
          city: city,
          password: password
        };

        // Remove city and country if they were not supplied (null)
        if(!user.city){
          delete user.city;
        }
        if(!user.country){
          delete user.country;
        }

        // Send a POST request to create the user
        // Will have 400 error if email already in use
        // If 200, log the user in
        this.$http.post('http://localhost:4941/api/v1/users/register', user).then((response) => {
          this.$http.post("http://localhost:4941/api/v1/users/login", {
            email: user.email,
            password: user.password
          }).then((response) => {
            // User is logged in, save the token
            this.$session.set("authToken", response.data.token);
            this.$session.set("userId", response.data.userId);
            this.getLoggedInUser();
          }).catch((err) => {
          if(err.response.status === 401){
            // User Auth token was incorrect! Not logged in
            this.$session.remove('authToken');
            this.$session.remove("userId");
            this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
          }else{
            //Unknown error
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
        }).catch((err) => {
          if(err.response.status === 400){
            this.openInformationalModal('Error while registering', 'Sorry, that email is already in use.');
          } else{
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          }
        });
      },

      /** Sets the image src to use the default image */
      setDefaultImg: function(userId, elementId) {
        if(elementId === null){
          elementId = "user_profile_img_" + userId;
        }
        document.getElementById(elementId).src = "default.png";
      },

      /** Sets the userEditPasswordIsBlank variable when the input is changed */
      setUserEditPasswordIsBlank: function() {
        this.userEditPasswordIsBlank = document.getElementById("user_edit_password").value === "";
      },

      /** Validates the edit user form */
      editUserValidate: function() {
        let data = {};
        let name = document.getElementById("user_edit_name").value;
        if(name !== ""){
          data.name = name;
        }
        let email = document.getElementById("user_edit_email").value;
        if(email !== ""){
          if(this.emailIsIncorrect("user_edit_email")){
            this.openInformationalModal('Error', 'Sorry, that email is not valid.');
            return;
          } else{
            data.email = email;
          }
        }
        let city = document.getElementById("user_edit_city").value;
        if(city !== ""){
          data.city = city;
        }
        let country = document.getElementById("user_edit_country").value;
        if(country !== ""){
          data.country = country;
        }
        let password = document.getElementById("user_edit_password").value;
        if(password !== ""){
          let currentPassword = document.getElementById("edit_user_current_password").value;
          if(currentPassword === ""){
            this.openInformationalModal("Error", "Sorry, but you need to enter your current password!");
            return;
          }
          data.password = password;
          data.currentPassword = currentPassword;
        }
        let rmImage = document.getElementById("edit_user_image_delete").checked;
        let image = document.getElementById("user_edit_image");

        if(Object.keys(data).length === 0 && data.constructor === Object && !rmImage && image.value === ""){
          this.openInformationalModal("Error editing " + this.logged_in_user.name, "You did not provide any" +
            " changes!");
          return;
        }
        this.editUser(data, rmImage, image);
      },

      /** Sends the API a PATCH request to edit the user */
      editUser: function(data, rmImage, image){
        if(Object.keys(data).length !== 0){
          this.$http.patch("http://localhost:4941/api/v1/users/" + this.$session.get("userId"), data, {
              headers: {
                "X-Authorization": this.$session.get("authToken")
              }
            }
          ).then((res) => {
            if(!rmImage && image.value === ""){
              this.openInformationalModal("Successful", "User has successfully been edited.");
              this.getLoggedInUser();
              this.getPetitions();
            }
          }).catch((err) => {
            if(err.response.status === 401){
              // User Auth token was incorrect! Not logged in
              this.$session.remove('authToken');
              this.$session.remove("userId");
              this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
            }else if(err.response.status === 400){
              this.openInformationalModal('Error 400', 'Whoops! It looks like your current password was incorrect.')
            }else{
              //Unknown error
              this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
            }
          });
        }

        if(rmImage){
          this.$http.delete("http://localhost:4941/api/v1/users/" + this.$session.get("userId") + "/photo", {
            headers: {
              "X-Authorization": this.$session.get("authToken")
            }
          }).then((res) => {
            if(image.value === ""){
              this.openInformationalModal("Successful", "User has successfully been edited.");
              this.getLoggedInUser();
              this.getPetitions();
            }
          }).catch((err) => {
            if(err.response.status === 401){
              // User Auth token was incorrect! Not logged in
              this.$session.remove('authToken');
              this.$session.remove("userId");
              this.openInformationalModal('Error 401', 'Sorry! You need to be logged in to do that.');
            }else{
              //Unknown error
              this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
            }
          });
        }

        if(image.value !== ""){
          this.$http.put("http://localhost:4941/api/v1/users/" + this.$session.get("userId") + "/photo", image.files[0], {
            headers: {
              "X-Authorization": this.$session.get("authToken"),
              "Content-Type": image.files[0].type
            }
          }).then((res) => {
            this.openInformationalModal("Successful", "User has successfully been edited.");
            this.getPetitions();
          }).catch((err) => {
            this.openInformationalModal('Error ' + err.response.status, err.response.statusText);
          });
        }
      }
    }
  }
</script>

<style>
  *:focus {
    outline: none;
  }
  .petition_table_button{
    background-color: darkorange;
    border: none;
    height: 2vw;
    width: 100%;
    display: block;
    margin: auto;
  }
  .petition_table_button:hover {
    background-color: #f6ce8a;
  }
  .petition_table_title{
    height: 100%;
    width: 19.6vw;
    text-align: center;
    font-size: 1.2vw;
  }
  #petitions_table{
    margin: auto;
    width: 98%;
    text-align: center;
    position: absolute;
    left: 1vw;
    top: 13vw;
    font-size: 1vw;
  }
  #petition_table_titles{
    color: black;
    background-color: darkorange;
  }
  .petition_table_entry, .petition_table_button, .common_button{
    transition: background-color 0.5s ease, color 0.5s ease, transform 0.5s ease;
  }
  .petition_table_entry:hover{
    background-color: #f6ce8a;
    cursor: pointer;
  }
  #page_title, #site_title{
    width: 100%;
    text-align: center;
  }
  #page_title{
    font-size: 1vw;
  }
  #site_title{
    font-size: 1.8vw;
  }
  #petition_instructions{
    text-align: center;
    position: absolute;
    left: 1vw;
    top: -1.4vw;
    width: 98%;
    font-size: 1vw;
  }
  #log_in_out{
    position: absolute;
    top: 1.5vw;
    right: 1vw;
    text-align: center;
    width: 10vw;
    font-size: 0.9vw;
  }
  #adv_search_button{
    margin-left: 1vw;
    position: relative;
    top: 2.5vw;
  }
  .common_button{
    width: 10vw;
    height: 3vw;
    background-color: white;
    border: 0.15vw solid darkorange;
    color: darkorange;
    font-size: 1vw;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .common_button:hover{
    transform: scale(1.05);
    background-color: darkorange;
    color: white;
  }
  #create_petition_button{
    position: absolute;
    top: 5vw;
    left: -44.5vw;
    width: 12vw;
  }
  #no_petitions{
    position: absolute;
    top: 15vw;
    left: 0.5vw;
    width: 100%;
    text-align: center;
    font-size: 1.3vw;
  }
  #view_own_petitions_instructions{
    font-size: 1vw;
    width: 100%;
    text-align: center;
  }
  #back_start,#back_page,#forward_last,#forward_page {
    width: 5vw;
    background-color: white;
    border: none;
    transition: background-color 0.5s ease, fill 0.5s ease, transform 0.5s ease;
    fill: darkorange;
  }
  #back_start:hover,#back_page:hover,#forward_last:hover,#forward_page:hover{
    background-color: darkorange;
    fill: white;
  }
</style>
