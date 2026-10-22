package com.example.internship_tracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

@AutoConfigureMockMvc
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1")
class InternshipTrackerApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void companyApiCanCreateAndListCompanies() throws Exception {
		mockMvc.perform(post("/companies")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"name":"Test Company","website":"https://example.com","location":"Remote"}
						"""))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.name").value("Test Company"));

		mockMvc.perform(get("/companies")
				.header("Origin", "http://localhost:5173"))
			.andExpect(status().isOk())
			.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
			.andExpect(jsonPath("$[?(@.name == 'Test Company')]").exists());
	}

}
