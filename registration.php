<!DOCTYPE html>
<html class="no-js" lang="zxx">
  <head>
    <?php include 'includes/head.php'; ?>

    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Register</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style>
      /* Ensure the container aligns items to the left */
      .tp-contact-location-wrap {
        /* "justify-content-start" in the HTML already does this,
     but you could also force it here if needed */
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      /* Style each contact link as a flex container */
      .tp-contact-location a {
        display: flex;
        align-items: center;
        text-align: left;
        margin-bottom: 10px;
        /* optional spacing between links */
      }

      /* Add spacing between the icon and text */
      .tp-contact-location a i {
        margin-right: 8px;
      }

      .tp-footer-widget-content-list-item {
        display: flex;
        align-items: center;
        /* Align items vertically */
        gap: 10px;
        /* Space between icon and text */
      }

      .tp-footer-widget-content-list-item i {
        font-size: 18px;
        /* Adjust icon size if needed */
      }

      .tp-footer-widget-content-list-item a {
        text-decoration: none;
        color: inherit;
        /* Maintain default text color */
      }

      .select-field {
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        appearance: none;
        /* Ensures default styles don't override */
      }

      .main-header .logo-box .logo img {
        max-width: 40% !important;
      }

      .form-section {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .required::after {
        content: "*";
        color: red;
        margin-left: 2px;
      }

      .section-color {
        background-color: #f0f8ff;
      }

      .table thead th {
        background-color: #ffcc00;
        color: black;
        text-align: center;
      }

      .table-bordered th,
      .table-bordered td {
        text-align: center;
        vertical-align: middle;
      }

      .category-header {
        background-color: #f8f9fa;
        font-weight: bold;
        text-align: center;
      }

      .table,
      .table-bordered th,
      .table-bordered td {
        border: 1px solid black !important;
      }

      .currency-selector {
        text-align: center;
        margin-bottom: 20px;
      }

      .registration-card {
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        margin: 10px;
        display: inline-block;
        width: 300px;
        text-align: center;
      }

      .registration-card button {
        padding: 10px 20px;
        margin-top: 10px;
        cursor: pointer;
      }
    </style>
    .
  </head>

  <body>
    <!-- pre loader area start -->

    <!-- pre loader area end -->

    <!-- back to top start -->

    <!-- back to top end -->

    <!-- header area start -->
    <header>
      <?php include('includes/header.php'); ?>
    </header>
    <!-- header area end -->

    <!-- offcanvas area start -->
    <div class="offcanvas__area">
      <div class="offcanvas__wrapper">
        <div class="offcanvas__close">
          <button class="offcanvas__close-btn offcanvas-close-btn">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 1L1 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L11 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="offcanvas__content">
          <div
            class="offcanvas__top mb-70 d-flex justify-content-between align-items-center"
          >
            <div class="offcanvas__logo logo">
              <a href="index.php">
                <img
                  src="assets/img/logo/finallogo-e1707385272842.png"
                  alt="logo"
                />
              </a>
            </div>
          </div>
          <div class="tp-main-menu-mobile"></div>
          <div class="offcanvas__btn">
            <a href="contact.php" class="tp-btn"
              >Getting Started <i class="fa-regular fa-chevron-right"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
    <div class="body-overlay"></div>

    <main>
      <!-- breadcrumb-area-start -->
      <section class="breadcrumb-area breadcrumb-wrap">
        <div
          class="breadcrumb-bg"
          data-background="assets/img/breadcrumb/register1.jpg"
        ></div>
        <div class="container">
          <div class="row align-items-center">
            <div class="col-12">
              <div class="tpbreadcrumb">
                <h2 class="breadcrumb-title">Register</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="breadcrumb-shape">
          <div
            class="breadcrumb-shape-1 wow fadeInRight"
            data-wow-duration="1.8s"
            data-wow-delay=".4s"
          >
            <img src="assets/img/breadcrumb/breadcrumb-shape-1.png" alt="" />
          </div>
          <div
            class="breadcrumb-shape-4 wow slideInRight"
            data-wow-duration="1.2s"
            data-wow-delay=".1s"
          ></div>
          <div
            class="breadcrumb-shape-5 wow slideInRight"
            data-wow-duration="1.4s"
            data-wow-delay=".3s"
          ></div>
        </div>
      </section>
      <!-- breadcrumb-area-end -->

      <!-- video-area-start -->
      <section class="py-5">
        <div class="container mt-4">
          <div class="row g-3">
            <!-- Shipping Information -->
            <div class="col-md-6">
              <div class="form-section">
                <h4>
                  <strong> Shipping Information </strong>
                </h4>
                <p style="visibility: hidden; margin-bottom: 11px">
                  Hidden space for equality
                </p>
                <form id="shippingForm">
                  <div class="row mb-3">
                    <div class="col">
                      <label class="required">Title</label>
                      <select
                        class="form-select select-field"
                        id="shippingtitle"
                        name="shipping_title"
                        required
                      >
                        <option value="">Select Title</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                      </select>
                    </div>
                    <div class="col">
                      <label class="required">Full Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="shippingname"
                        name="shipping_name"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="required">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="shippingemail"
                      name="shipping_email"
                      placeholder="Your Email"
                      required
                    />
                  </div>

                  <div class="row mb-3">
                    <div class="col">
                      <label class="required">Phone</label>
                      <input
                        type="tel"
                        class="form-control"
                        id="shippingphone"
                        name="shipping_phone"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div class="col">
                      <label class="required">Country</label>
                      <select
                        class="form-select select-field"
                        id="shippingCountry"
                        name="shipping_country"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Aland Islands">Aland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Amman">Amman</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cango">Cango</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">
                          Central African Republic
                        </option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote dIvoire">Cote dIvoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Democratic Republic of the Congo">
                          Democratic Republic of the Congo
                        </option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominican Republic">
                          Dominican Republic
                        </option>
                        <option value="Dublin">Dublin</option>
                        <option value="East Timor">East Timor</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="England">England</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Europe">Europe</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Ivory Coast">Ivory Coast</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Johor Bahru">Johor Bahru</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kaula Lumpur">Kaula Lumpur</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kosovo">Kosovo</option>
                        <option value="Kota Kinabalu">Kota Kinabalu</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Kuantan">Kuantan</option>
                        <option value="Kuching">Kuching</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macau (China)">Macau (China)</option>
                        <option value="Macedonia">Macedonia</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Mississippi">Mississippi</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="mongolia">mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Guinea">New Guinea</option>
                        <option value="Newzealand">Newzealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North America">North America</option>
                        <option value="North Korea">North Korea</option>
                        <option value="Norway">Norway</option>
                        <option value="Oceania">Oceania</option>
                        <option value="Oman">Oman</option>
                        <option value="Oregon">Oregon</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palestine">Palestine</option>
                        <option value="Panama">Panama</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Penang">Penang</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Republic of Ireland">
                          Republic of Ireland
                        </option>
                        <option value="Republic of Macedonia">
                          Republic of Macedonia
                        </option>
                        <option value="Republic of Yugoslavia">
                          Republic of Yugoslavia
                        </option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis
                        </option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">
                          Sao Tome and Principe
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Shah Alam">Shah Alam</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">
                          Svalbard and Jan Mayen
                        </option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor Leste">Timor Leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Trinidad and Tobago">
                          Trinidad and Tobago
                        </option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="UAE">UAE</option>
                        <option value="Uganda">Uganda</option>
                        <option value="UK">UK</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="USA">USA</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vatican">Vatican</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Wales">Wales</option>
                        <option value="West Indies">West Indies</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                    </div>
                    <div class="col">
                      <label class="required">City</label>
                      <input
                        type="text"
                        class="form-control"
                        id="shippingcity"
                        name="shipping_city"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="required">Address</label>
                    <textarea
                      class="form-control"
                      id="shippingaddress"
                      name="shipping_address"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>

            <!-- Billing Information -->
            <div class="col-md-6">
              <div class="form-section">
                <h4>
                  <strong> Billing Information </strong>
                </h4>
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="sameInfo"
                  />
                  <label class="form-check-label" for="sameInfo">
                    If Billing Information same, please click here.
                  </label>
                </div>

                <form id="billingForm">
                  <div class="row mb-3">
                    <div class="col">
                      <label class="required">Title</label>
                      <select
                        class="form-select select-field"
                        id="billingtitle"
                        name="billing_title"
                        required
                      >
                        <option value="">Select Title</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                      </select>
                    </div>
                    <div class="col">
                      <label class="required">Full Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="billingname"
                        name="billing_name"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="required">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="billingemail"
                      name="billing_email"
                      placeholder="Your Email"
                      required
                    />
                  </div>

                  <div class="row mb-3">
                    <div class="col">
                      <label class="required">Phone</label>
                      <input
                        type="tel"
                        class="form-control"
                        id="billingPhone"
                        name="billing_phone"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div class="col">
                      <label class="required">Country</label>
                      <select
                        class="form-select select-field"
                        id="billingCountry"
                        name="billing_country"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Aland Islands">Aland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Amman">Amman</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cango">Cango</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">
                          Central African Republic
                        </option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote dIvoire">Cote dIvoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Democratic Republic of the Congo">
                          Democratic Republic of the Congo
                        </option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominican Republic">
                          Dominican Republic
                        </option>
                        <option value="Dublin">Dublin</option>
                        <option value="East Timor">East Timor</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="England">England</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Europe">Europe</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Ivory Coast">Ivory Coast</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Johor Bahru">Johor Bahru</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kaula Lumpur">Kaula Lumpur</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kosovo">Kosovo</option>
                        <option value="Kota Kinabalu">Kota Kinabalu</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Kuantan">Kuantan</option>
                        <option value="Kuching">Kuching</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macau (China)">Macau (China)</option>
                        <option value="Macedonia">Macedonia</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Mississippi">Mississippi</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="mongolia">mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Guinea">New Guinea</option>
                        <option value="Newzealand">Newzealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North America">North America</option>
                        <option value="North Korea">North Korea</option>
                        <option value="Norway">Norway</option>
                        <option value="Oceania">Oceania</option>
                        <option value="Oman">Oman</option>
                        <option value="Oregon">Oregon</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palestine">Palestine</option>
                        <option value="Panama">Panama</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Penang">Penang</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Republic of Ireland">
                          Republic of Ireland
                        </option>
                        <option value="Republic of Macedonia">
                          Republic of Macedonia
                        </option>
                        <option value="Republic of Yugoslavia">
                          Republic of Yugoslavia
                        </option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis
                        </option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">
                          Sao Tome and Principe
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Shah Alam">Shah Alam</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">
                          Svalbard and Jan Mayen
                        </option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor Leste">Timor Leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Trinidad and Tobago">
                          Trinidad and Tobago
                        </option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="UAE">UAE</option>
                        <option value="Uganda">Uganda</option>
                        <option value="UK">UK</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="USA">USA</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vatican">Vatican</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Wales">Wales</option>
                        <option value="West Indies">West Indies</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                    </div>
                    <div class="col">
                      <label class="required">City</label>
                      <input
                        type="text"
                        class="form-control"
                        id="billingcity"
                        name="billing_city"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="required">Address</label>
                    <textarea
                      class="form-control"
                      id="billingaddress"
                      name="billing_address"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <?php
    if ($_GET['type'] == "conference") {
    ?>
      <section id="conferencesPrices" class="section-color">
        <div class="container py-4">
          <h2 class="text-center mb-4">
            <strong> REGISTRATION PRICES - HYBRID </strong>
          </h2>

          <!-- Currency Selection -->
          <div class="text-center mb-3">
            <label>
              <input
                type="radio"
                id="currencyUSD_conference"
                name="currency"
                value="USD"
                checked
              />
              USD ($)
            </label>
            <label>
              <input
                type="radio"
                id="currencyGBP_conference"
                name="currency"
                value="GBP"
              />
              GBP (£)
            </label>
            <label>
              <input
                type="radio"
                id="currencyEUR_conference"
                name="currency"
                value="EUR"
              />
              EUR (€)
            </label>
          </div>

          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>ACADEMIC PRICE</th>
                    <th>BUSINESS PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>e-Poster</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check price-cell"
                        data-usd="199"
                        name="e_poster_academic"
                      />
                      <span class="price">$ 199</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="249"
                        name="e_poster_business"
                      />
                      <span class="price">$ 249</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Poster Presentation</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="349"
                        name="poster_academic"
                      />
                      <span class="price">$ 349</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="399"
                        name="poster_business"
                      />
                      <span class="price">$ 399</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Video Presentation</td>

                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="449"
                        name="video_academic"
                      />
                      <span class="price">$ 449</span>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="499"
                        name="video_business"
                      />
                      <span class="price">$ 499</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Virtual Presentation</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="599"
                        name="virtual_academic"
                      />
                      <span class="price">$ 599</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="649"
                        name="virtual_business"
                      />
                      <span class="price">$ 649</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Oral Presentation</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="899"
                        name="oral_academic"
                      />
                      <span class="price">$ 899</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="999"
                        name="oral_business"
                      />
                      <span class="price">$ 999</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Delegate</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="349"
                        name="delegate_academic"
                      />
                      <span class="price">$ 349</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="399"
                        name="delegate_business"
                      />
                      <span class="price">$ 399</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Suit - A (OP + 2N stay)</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1199"
                        name="suite_a_academic"
                      />
                      <span class="price">$ 1199</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1399"
                        name="suite_a_business"
                      />
                      <span class="price">$ 1399</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Suit - B (OP + 3N stay)</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1399"
                        name="suite_b_academic"
                      />
                      <span class="price">$ 1399</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1599"
                        name="suite_b_business"
                      />
                      <span class="price">$ 1599</span>
                    </td>
                  </tr>

                  <tr>
                    <th colspan="3" class="header">Add-Ons</th>
                  </tr>
                  <tr>
                    <td data-label="Category">Accompanying Person</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="349"
                        name="addon_accompanying_academic"
                      />
                      <span class="price">$ 349</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="499"
                        name="addon_accompanying_business"
                      />
                      <span class="price">$ 499</span>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Category">Extra N-Stay</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="249"
                        name="addon_extra_stay_academic"
                      />
                      <span class="price">$ 249</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="249"
                        name="addon_extra_stay_business"
                      />
                      <span class="price">$ 249</span>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Category">Article Publication</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1099"
                        name="addon_article_publication_academic"
                      />
                      <span class="price">$ 1099</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1299"
                        name="addon_article_publication_business"
                      />
                      <span class="price">$ 1299</span>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Category">Exhibitor</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="3999"
                        name="addon_exhibitor_academic"
                      />
                      <span class="price">$ 3999</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="5999"
                        name="addon_exhibitor_business"
                      />
                      <span class="price">$ 5999</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <?php
    }
    ?>

      <?php
    if ($_GET['type'] == "webinar") {

    ?>
      <section id="webinarPrices" class="section-color">
        <div class="container py-4">
          <h2 class="text-center mb-4">
            <strong> REGISTRATION PRICES - WEBINAR </strong>
          </h2>

          <!-- Currency Selection -->
          <!-- The form here is likely for currency selection, not the main payment form,
                     so no action/method needed for this internal form. -->
          <div class="text-center mb-3">
            <label>
              <input
                type="radio"
                name="currency"
                id="currencyUSD_webinar"
                value="USD"
                checked
              />
              USD ($)
            </label>
            <label>
              <input
                type="radio"
                name="currency"
                id="currencyGBP_webinar"
                value="GBP"
              />
              GBP (£)
            </label>
            <label>
              <input
                type="radio"
                name="currency"
                id="currencyEUR_webinar"
                value="EUR"
              />
              EUR (€)
            </label>
          </div>

          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>ACADEMIC</th>
                    <th>BUSINESS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>e-Poster</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="149"
                        name="webinar_eposter_academic"
                      />
                      <span class="price">$ 149</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="199"
                        name="webinar_eposter_business"
                      />
                      <span class="price">$ 199</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Video Presentation</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="399"
                        name="webinar_video_academic"
                      />
                      <span class="price">$ 399</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="499"
                        name="webinar_video_business"
                      />
                      <span class="price">$ 499</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Virtual Presentation</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="499"
                        name="webinar_virtual_academic"
                      />
                      <span class="price">$ 499</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="599"
                        name="webinar_virtual_business"
                      />
                      <span class="price">$ 599</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Delegate</td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="349"
                        name="webinar_delegate_academic"
                      />
                      <span class="price">$ 349</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="449"
                        name="webinar_delegate_business"
                      />
                      <span class="price">$ 449</span>
                    </td>
                  </tr>

                  <tr>
                    <th colspan="3" class="header">Add-Ons</th>
                  </tr>
                  <tr>
                    <td data-label="Category">Article Publication</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1099"
                        name="webinar_addon_article_academic"
                      />
                      <span class="price">$ 1099</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1299"
                        name="webinar_addon_article_business"
                      />
                      <span class="price">$ 1299</span>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Category">Exhibitor</td>
                    <td data-label="Academic">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="1999"
                        name="webinar_addon_exhibitor_academic"
                      />
                      <span class="price">$ 1999</span>
                    </td>
                    <td data-label="Business">
                      <input
                        type="checkbox"
                        class="price-check"
                        data-usd="2999"
                        name="webinar_addon_exhibitor_business"
                      />
                      <span class="price">$ 2999</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Total & Payment Controls -->
          <!-- Removed the form tag here as it was enclosing only currency selection -->
        </div>
      </section>
      <?php
    }
    ?>

      <!-- Total Payment Section -->
      <section class="py-5">
        <div class="container text-center">
          <h6 class="text-center">
            All Prices are in <span id="currency_code"> USD </span>
            only.
          </h6>
          <p class="px-4 text-center">
            For any registration queries and other payment methods like bank
            transfers and PayPal feel free to reach us
            <a href="mailto:hello@helixconferences.com">
              hello@helixconferences.com
            </a>
          </p>

          <h4 class="text-center">
            <strong>
              Selected Total:
              <span id="selected-total"> $ 0 </span>
            </strong>
          </h4>

          <!-- Main Payment Submission Form -->
          <form
            action="paypalpayment.php"
            method="post"
            onsubmit="return appenddata()"
          >
            <input type="hidden" name="currency" id="currency" />
            <input type="hidden" id="amount" name="amount" />
            <input type="hidden" id="email" name="email" />
            <input type="hidden" id="phone" name="phone" />

            <!-- Hidden inputs for Shipping details (will be populated by JS) -->
            <input
              type="hidden"
              name="shippingName"
              id="hidden_shipping_name"
            />
            <input
              type="hidden"
              name="shippingEmail"
              id="hidden_shipping_email"
            />
            <input
              type="hidden"
              name="shippingAddress"
              id="hidden_shipping_address"
            />
            <input
              type="hidden"
              name="shippingCity"
              id="hidden_shipping_city"
            />
            <input
              type="hidden"
              name="shippingPhone"
              id="hidden_shipping_phone"
            />
            <input
              type="hidden"
              name="shippingTitle"
              id="hidden_shipping_title"
            />
            <input
              type="hidden"
              name="shippingCountry"
              id="hidden_shipping_country"
            />

            <!-- Hidden inputs for Billing details (will be populated by JS) -->
            <input type="hidden" name="billingName" id="hidden_billing_name" />
            <input
              type="hidden"
              name="billingEmail"
              id="hidden_billing_email"
            />
            <input
              type="hidden"
              name="billingAddress"
              id="hidden_billing_address"
            />
            <input type="hidden" name="billingCity" id="hidden_billing_city" />
            <input
              type="hidden"
              name="billingPhone"
              id="hidden_billing_phone"
            />
            <input
              type="hidden"
              name="billingTitle"
              id="hidden_billing_title"
            />
            <input
              type="hidden"
              name="billingCountry"
              id="hidden_billing_country"
            />

            <!-- Hidden input for selected items JSON (will be populated by JS) -->
            <input
              type="hidden"
              name="selectedItems"
              id="hidden_selected_items"
            />

            <button class="btn btn-primary" id="proceed" type="submit" disabled>
              Proceed to Pay
            </button>
          </form>
        </div>
      </section>
    </main>

    <!-- footer-area-start -->
    <footer>
      <?php include('includes/footer.php'); ?>
    </footer>
    <!-- footer-area-end -->

    <?php include('includes/script.php'); ?>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const checkboxes = document.querySelectorAll(".price-check");
        const totalSpan = document.getElementById("webinarTotalAmount");
        const totalInput = document.getElementById("webinarTotalInput");
        const itemsInput = document.getElementById("webinarSelectedItems");
        const currencyRadios = document.querySelectorAll(
          'input[name="currency"]'
        );
        const currencyInput = document.getElementById("webinarCurrencyInput");

        function getSelectedCurrency() {
          const selected = document.querySelector(
            'input[name="currency"]:checked'
          );
          return selected ? selected.value.toLowerCase() : "usd";
        }

        function updateTotal() {
          let total = 0;
          let selectedItems = [];
          const currency = getSelectedCurrency();

          checkboxes.forEach((cb) => {
            if (cb.checked) {
              const price =
                parseFloat(cb.getAttribute(`data-${currency}`)) || 0;
              const category = cb
                .closest("tr")
                .querySelector("td")
                .textContent.trim();
              total += price;
              selectedItems.push(
                `${category}: ${price} ${currency.toUpperCase()}`
              );
            }
          });

          // Update UI and hidden fields
          totalSpan.textContent = `${currency.toUpperCase()} ${total}`;
          totalInput.value = total.toFixed(2);
          itemsInput.value = selectedItems.join(", ");
          currencyInput.value = currency.toUpperCase();
        }

        checkboxes.forEach((cb) => cb.addEventListener("change", updateTotal));
        currencyRadios.forEach((r) =>
          r.addEventListener("change", updateTotal)
        );

        updateTotal(); // Initial calculation

        function appenddata() {
          debugger;
        }
      });
    </script>

    <script>
      // Copy shipping info to billing info when checkbox is checked
      document
        .getElementById("sameInfo")
        .addEventListener("change", function () {
          const shippingForm = document.querySelectorAll(
            "#shippingForm input, #shippingForm select, #shippingForm textarea"
          );
          const billingForm = document.querySelectorAll(
            "#billingForm input, #billingForm select, #billingForm textarea"
          );

          if (this.checked) {
            shippingForm.forEach((input, index) => {
              billingForm[index].value = input.value;
              billingForm[index].disabled = true;
            });
          } else {
            billingForm.forEach((input) => {
              input.disabled = false;
              input.value = ""; // Clear fields when unchecked
            });
          }
        });
    </script>

    <script>
      const exchangeRates = {
        USD: 1,
        GBP: 1, // Static GBP prices override this
        EUR: 1, // Static EUR prices override this
      };

      const euroPrices = {
        199: "195",
        249: "255",
        349: "205",
        399: "355",
        449: "405",
        499: "455",
        599: "505",
        649: "555",
        899: "705",
        999: "655",
        1199: "905",
        1399: "1,155",
        1599: "1,255",
      };

      const gbpPrices = {
        199: "179",
        249: "259",
        349: "259",
        399: "359",
        449: "409",
        499: "459",
        599: "509",
        649: "559",
        899: "709",
        999: "659",
        1199: "909",
        1299: "1,059",
        1399: "1,009",
        1599: "1,259",
      };

      let selectedCurrency = "USD"; // Default Currency

      function updatePrices() {
        const selectedCurrency = document.querySelector(
          'input[name="currency"]:checked'
        ).value;
        const symbol =
          selectedCurrency === "USD"
            ? "$"
            : selectedCurrency === "GBP"
            ? "£"
            : "€";

        document.querySelectorAll(".price-check").forEach((checkbox) => {
          const usdValue = parseFloat(checkbox.getAttribute("data-usd"));
          let displayValue;

          // Use predefined mappings if available
          if (
            selectedCurrency === "EUR" &&
            typeof euroPrices !== "undefined" &&
            euroPrices[usdValue]
          ) {
            displayValue = euroPrices[usdValue];
          } else if (
            selectedCurrency === "GBP" &&
            typeof gbpPrices !== "undefined" &&
            gbpPrices[usdValue]
          ) {
            displayValue = gbpPrices[usdValue];
          } else if (
            typeof exchangeRates !== "undefined" &&
            exchangeRates[selectedCurrency]
          ) {
            // Fallback to conversion rate if no mapping
            const rate = exchangeRates[selectedCurrency];
            displayValue = (usdValue * rate).toFixed(2);
          } else {
            // Default to USD value
            displayValue = usdValue.toFixed(2);
          }

          const priceSpan = checkbox.nextElementSibling;
          if (priceSpan && priceSpan.classList.contains("price")) {
            priceSpan.textContent = `${symbol} ${displayValue}`;
          }
        });

        if (typeof updateTotal === "function") {
          updateTotal();
        }
      }

      function updateTotal() {
        let selectedTotal = 0;
        document
          .querySelectorAll(".price-check:checked")
          .forEach((checkbox) => {
            const usdValue = parseFloat(checkbox.getAttribute("data-usd"));
            let value;

            if (selectedCurrency === "EUR" && euroPrices[usdValue]) {
              value = parseFloat(euroPrices[usdValue].replace(/,/g, ""));
            } else if (selectedCurrency === "GBP" && gbpPrices[usdValue]) {
              value = parseFloat(gbpPrices[usdValue].replace(/,/g, ""));
            } else {
              value = usdValue * exchangeRates[selectedCurrency];
            }

            selectedTotal += value;
          });

        const symbol =
          selectedCurrency === "USD"
            ? "$"
            : selectedCurrency === "GBP"
            ? "£"
            : "€";
        document.getElementById(
          "selected-total"
        ).textContent = `${symbol} ${selectedTotal.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }

      document.querySelectorAll('input[name="currency"]').forEach((radio) => {
        radio.addEventListener("change", function () {
          selectedCurrency = this.value;
          updatePrices();
        });
      });

      document.querySelectorAll(".price-check").forEach((checkbox) => {
        checkbox.addEventListener("change", updateTotal);
      });

      document.getElementById("proceed").addEventListener("click", function () {
        let finalTotal = parseFloat(
          document
            .getElementById("selected-total")
            .textContent.replace(/[^0-9.]/g, "")
        );
        if (finalTotal > 0) {
          var currency = $("input[name='currency']:checked").val();
          $("#amount").val(finalTotal);
          $("#currency").val(currency);
          $("#email").val($("#shippingemail").val());
          $("#phone").val($("#shippingphone").val());

          return true;
        } else {
          alert("Please select an amount before proceeding.");
        }
      });

      // Initialize prices on page load
      updatePrices();
    </script>

    <!-- FORM FIELDS -->
    <script>
      function getSelectedItemsString() {
        let selectedItems = [];
        document.querySelectorAll(".price-check:checked").forEach((cb) => {
          const category = cb
            .closest("tr")
            .querySelector("td")
            .textContent.trim();
          const price = cb.nextElementSibling.textContent.trim();
          selectedItems.push(`${category}: ${price}`);
        });
        return selectedItems.join(", ");
      }

      function appenddata() {
        const shippingForm = document.getElementById("shippingForm");
        const billingForm = document.getElementById("billingForm");

        const shippingValid = validateForm(shippingForm);
        const billingValid = validateForm(billingForm);

        if (!shippingValid || !billingValid) {
          alert("Please fill in all required fields.");
          return false;
        }

        // Copy shipping info from main inputs to hidden inputs in the payment form
        document.querySelector('input[name="shippingName"]').value =
          document.getElementById("shippingname").value;
        document.querySelector('input[name="shippingEmail"]').value =
          document.getElementById("shippingemail").value;
        document.querySelector('input[name="shippingAddress"]').value =
          document.getElementById("shippingaddress").value;
        document.querySelector('input[name="shippingCity"]').value =
          document.getElementById("shippingcity").value;
        document.querySelector('input[name="shippingPhone"]').value =
          document.getElementById("shippingphone").value;
        document.getElementById("hidden_shipping_country").value =
          document.getElementById("shippingCountry").value;

        // Copy billing info from main inputs to hidden inputs in the payment form
        document.querySelector('input[name="billingName"]').value =
          document.getElementById("billingname").value;
        document.querySelector('input[name="billingEmail"]').value =
          document.getElementById("billingemail").value;
        document.querySelector('input[name="billingAddress"]').value =
          document.getElementById("billingaddress").value;
        document.querySelector('input[name="billingCity"]').value =
          document.getElementById("billingcity").value;
        document.querySelector('input[name="billingPhone"]').value =
          document.getElementById("billingPhone").value;
        document.getElementById("hidden_billing_country").value =
          document.getElementById("billingCountry").value;

        // Copy main contact info for payment
        document.getElementById("email").value =
          document.getElementById("shippingemail").value;
        document.getElementById("phone").value =
          document.getElementById("shippingphone").value;

        // Copy amount and currency
        document.getElementById("amount").value = document
          .getElementById("selected-total")
          .innerText.trim();
        // If you have a hidden currency input, set it here if needed
        // document.getElementById("currency_hidden_input").value = "USD";

        // Copy selected items using the new function
        document.getElementById("hidden_selected_items").value =
          getSelectedItemsString();

        // Optional: Add console logs for debugging what's being sent
        // console.log("Shipping Country value set to:", document.getElementById("hidden_shipping_country").value);
        // console.log("Billing Country value set to:", document.getElementById("hidden_billing_country").value);
        // console.log("Selected Items content:", document.getElementById('hidden_selected_items').value);

        return true;
      }

      function validateForm(form) {
        const fields = form.querySelectorAll("input"); // Note: This only validates INPUTs, not SELECTs
        let valid = true;
        fields.forEach((field) => {
          if (!field.checkValidity()) {
            field.classList.add("is-invalid");
            valid = false;
          } else {
            field.classList.remove("is-invalid");
          }
        });
        // Add validation for select elements if they are required
        const selects = form.querySelectorAll("select[required]");
        selects.forEach((select) => {
          if (!select.value) {
            // If select value is empty
            select.classList.add("is-invalid");
            valid = false;
          } else {
            select.classList.remove("is-invalid");
          }
        });
        return valid;
      }
    </script>

    <script>
      const proceedButton = document.getElementById("proceed");
      const checkboxes = document.querySelectorAll(".price-check");

      function toggleProceedButton() {
        const anyChecked = Array.from(checkboxes).some(
          (checkbox) => checkbox.checked
        );
        proceedButton.disabled = !anyChecked;
      }

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", toggleProceedButton);
      });

      toggleProceedButton(); // Initial check
    </script>

    <script>
      // Auto-copy email from shipping to billing
      document
        .getElementById("shippingemail")
        .addEventListener("input", function () {
          const shippingEmail = this.value;
          const billingEmailField = document.querySelector(
            "#billingForm input[type='email']"
          );
          billingEmailField.value = shippingEmail;
        });
      const shippingEmail = document.getElementById("shippingemail");
      const billingEmail = document.querySelector(
        "#billingForm input[type='email']"
      );
      const sameInfoCheckbox = document.getElementById("sameInfo");

      shippingEmail.addEventListener("input", function () {
        if (sameInfoCheckbox.checked) {
          billingEmail.value = this.value;
        }
      });

      // Also update billing email again if checkbox is checked later
      sameInfoCheckbox.addEventListener("change", function () {
        if (this.checked) {
          billingEmail.value = shippingEmail.value;
        }
      });

      document
        .getElementById("proceed")
        .addEventListener("click", function (e) {
          // e.preventDefault(); // Prevent default action like form submission

          const shippingForm = document.getElementById("shippingForm");
          const billingForm = document.getElementById("billingForm");

          const isShippingValid = shippingForm.checkValidity();
          const isBillingValid = billingForm.checkValidity();

          if (!isShippingValid || !isBillingValid) {
            // alert("❗ Please fill out all required fields before proceeding to payment.");

            // This shows browser's red validation hints
            if (!isShippingValid) {
              shippingForm.reportValidity();
            } else {
              billingForm.reportValidity();
            }

            return; // Stop further execution
          }

          // ✅ If both forms are valid, proceed to your payment integration here
          alert("✅ All details are valid. Proceeding to payment...");

          // Optionally trigger payment gateway logic here...
        });
    </script>
  </body>
</html>
